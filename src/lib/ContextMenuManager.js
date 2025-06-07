export class ContextMenuManager {
  constructor(tabManager) {
    this.tabManager = tabManager;
    this.menuItems = [
      {
        id: 'suspend-unsuspend',
        title: 'Suspend/Unsuspend this tab'
      },
      {
        id: 'pause-unpause',
        title: 'Pause/Unpause suspension of this tab'
      },
      {
        id: 'never-suspend-url',
        title: 'Never suspend this URL'
      },
      {
        id: 'never-suspend-domain',
        title: 'Never suspend this domain'
      },
      { id: 'separator-1', type: 'separator' },
      {
        id: 'suspend-selected',
        title: 'Suspend selected tabs'
      },
      {
        id: 'unsuspend-selected',
        title: 'Unsuspend selected tabs'
      },
      { id: 'separator-2', type: 'separator' },
      {
        id: 'suspend-others',
        title: 'Suspend all other tabs in this window'
      },
      {
        id: 'force-suspend-others',
        title: 'Force suspend all other tabs in this window'
      },
      {
        id: 'unsuspend-window',
        title: 'Unsuspend all tabs in this window'
      },
      { id: 'separator-3', type: 'separator' },
      {
        id: 'suspend-all',
        title: 'Suspend all tabs in all windows'
      },
      {
        id: 'force-suspend-all',
        title: 'Force suspend all tabs in all windows'
      },
      {
        id: 'unsuspend-all',
        title: 'Unsuspend all tabs in all windows'
      }
    ];
  }

  async createMenus() {
    // Remove existing menu items
    await chrome.contextMenus.removeAll();

    // Create new menu items
    for (const item of this.menuItems) {
      chrome.contextMenus.create({
        id: item.id,
        title: item.title,
        type: item.type || 'normal',
        contexts: ['all']
      });
    }

    // Add click listener
    chrome.contextMenus.onClicked.addListener((info, tab) => this.handleMenuClick(info, tab));
  }

  async handleMenuClick(info, tab) {
    switch (info.menuItemId) {
      case 'suspend-unsuspend':
        await this.tabManager.toggleSuspension(tab.id);
        break;

      case 'suspend-selected':
        const selectedTabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
        for (const tab of selectedTabs) {
          await this.tabManager.suspendTab(tab.id, true);
        }
        break;

      case 'unsuspend-selected':
        const suspendedTabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
        for (const tab of suspendedTabs) {
          await this.tabManager.unsuspendTab(tab.id);
        }
        break;

      case 'suspend-others':
        const otherTabs = await chrome.tabs.query({ active: false, currentWindow: true });
        for (const tab of otherTabs) {
          await this.tabManager.suspendTab(tab.id, true);
        }
        break;

      case 'force-suspend-others':
        const remainingTabs = await chrome.tabs.query({ active: false, currentWindow: true });
        for (const tab of remainingTabs) {
          await this.tabManager.suspendTab(tab.id, true);
        }
        break;

      case 'unsuspend-window':
        const windowTabs = await chrome.tabs.query({ currentWindow: true });
        for (const tab of windowTabs) {
          await this.tabManager.unsuspendTab(tab.id);
        }
        break;

      case 'suspend-all':
        const allTabs = await chrome.tabs.query({});
        for (const tab of allTabs) {
          await this.tabManager.suspendTab(tab.id, true);
        }
        break;

      case 'force-suspend-all':
        const everyTab = await chrome.tabs.query({});
        for (const tab of everyTab) {
          await this.tabManager.suspendTab(tab.id, true);
        }
        break;

      case 'unsuspend-all':
        const suspendedAllTabs = await chrome.tabs.query({});
        for (const tab of suspendedAllTabs) {
          await this.tabManager.unsuspendTab(tab.id);
        }
        break;
    }
  }
}
