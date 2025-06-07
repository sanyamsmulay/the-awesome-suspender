import { TabManager } from './lib/TabManager';
import { ContextMenuManager } from './lib/ContextMenuManager';
import { StorageManager } from './lib/StorageManager';
import { SessionManager } from './lib/SessionManager';

class BackgroundWorker {
  constructor() {
    this.storage = new StorageManager();
    this.tabManager = new TabManager(this.storage);
    this.contextMenu = new ContextMenuManager(this.tabManager);
    this.sessionManager = new SessionManager(this.storage);
    
    this.init();
  }

  async init() {
    await this.setupListeners();
    await this.initializeContextMenus();
    await this.startTabMonitoring();
    await this.setupMessageHandling();
  }

  async setupMessageHandling() {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      switch (message.action) {
        case 'toggleSuspension':
          await this.tabManager.toggleSuspension(message.tabId);
          break;
        case 'suspendOthers':
          const otherTabs = await chrome.tabs.query({ active: false, currentWindow: true });
          for (const tab of otherTabs) {
            await this.tabManager.suspendTab(tab.id, true);
          }
          break;
        case 'suspendAll':
          const allTabs = await chrome.tabs.query({});
          for (const tab of allTabs) {
            await this.tabManager.suspendTab(tab.id, true);
          }
          break;
        case 'unsuspendAll':
          const suspendedTabs = await chrome.tabs.query({});
          for (const tab of suspendedTabs) {
            await this.tabManager.unsuspendTab(tab.id);
          }
          break;
        case 'settingsUpdated':
          // Handle settings update if needed
          break;
      }
      // Required for async message handling
      sendResponse({});
      return true;
    });
  }

  async setupListeners() {
    // Listen for commands (keyboard shortcuts)
    chrome.commands.onCommand.addListener((command) => {
      switch (command) {
        case 'suspend-unsuspend':
          this.tabManager.toggleSuspension();
          break;
      }
    });

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.tabManager.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Listen for tab activation
    chrome.tabs.onActivated.addListener(({ tabId }) => {
      this.tabManager.handleTabActivation(tabId);
    });
  }

  async initializeContextMenus() {
    await this.contextMenu.createMenus();
  }

  async startTabMonitoring() {
    // Start the periodic check for tabs that need suspension
    setInterval(() => {
      this.tabManager.checkForInactiveTabs();
    }, 60000); // Check every minute
  }
}

// Initialize the background worker
const worker = new BackgroundWorker();
