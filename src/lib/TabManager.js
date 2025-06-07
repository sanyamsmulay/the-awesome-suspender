export class TabManager {
  constructor(storageManager) {
    this.storage = storageManager;
    this.suspendedTabs = new Map();
    this.lastActiveTime = new Map();
  }

  async toggleSuspension(tabId = null) {
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab.id;
    }

    const tab = await chrome.tabs.get(tabId);
    if (this.isTabSuspended(tab)) {
      await this.unsuspendTab(tabId);
    } else {
      await this.suspendTab(tabId);
    }
  }

  async suspendTab(tabId, force = false) {
    const tab = await chrome.tabs.get(tabId);
    
    // Only check suspension rules for automatic suspension
    if (!force && await this.shouldAutoSuspend(tab)) {
      return;
    }

    const suspendUrl = chrome.runtime.getURL('suspended/suspended.html');
    await chrome.tabs.update(tabId, {
      url: `${suspendUrl}?url=${encodeURIComponent(tab.url)}&title=${encodeURIComponent(tab.title)}`
    });

    this.suspendedTabs.set(tabId, tab.url);
  }

  async unsuspendTab(tabId) {
    const originalUrl = this.suspendedTabs.get(tabId);
    if (originalUrl) {
      await chrome.tabs.update(tabId, { url: originalUrl });
      this.suspendedTabs.delete(tabId);
    }
  }

  async shouldAutoSuspend(tab) {
    const settings = await this.storage.getSettings();
    
    // Check whitelist conditions
    if (tab.pinned) return false;
    if (tab.audible) return false;
    if (tab.active) return false;
    if (!navigator.onLine) return false;

    // Check URL whitelist
    const whitelistedUrls = settings.whitelistedUrls || [];
    if (whitelistedUrls.some(pattern => tab.url.includes(pattern))) {
      return false;
    }

    // Check form input
    const hasFormInput = await this.checkForFormInput(tab.id);
    if (hasFormInput) return false;

    // Check inactivity time
    const lastActive = this.lastActiveTime.get(tab.id) || Date.now();
    const inactiveTime = Date.now() - lastActive;
    return inactiveTime >= (settings.autoSuspendTimeout || 1800000); // Default 30 minutes
  }

  async checkForFormInput(tabId) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        function: () => {
          const forms = document.forms;
          for (const form of forms) {
            for (const element of form.elements) {
              if (element.value && element.type !== 'hidden') {
                return true;
              }
            }
          }
          return false;
        }
      });
      return results[0]?.result || false;
    } catch (e) {
      return false;
    }
  }

  isTabSuspended(tab) {
    const suspendUrl = chrome.runtime.getURL('suspended/suspended.html');
    return tab.url.startsWith(suspendUrl);
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      this.lastActiveTime.set(tabId, Date.now());
    }
  }

  async handleTabActivation(tabId) {
    this.lastActiveTime.set(tabId, Date.now());
    const settings = await this.storage.getSettings();
    
    if (settings.autoUnsuspend) {
      const tab = await chrome.tabs.get(tabId);
      if (this.isTabSuspended(tab)) {
        await this.unsuspendTab(tabId);
      }
    }
  }

  async checkForInactiveTabs() {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (await this.shouldAutoSuspend(tab)) {
        await this.suspendTab(tab.id, false);
      }
    }
  }
}
