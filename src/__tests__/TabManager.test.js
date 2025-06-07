import { TabManager } from '../lib/TabManager';
import { StorageManager } from '../lib/StorageManager';

// Mock chrome API
global.chrome = {
  tabs: {
    get: jest.fn(),
    query: jest.fn(),
    update: jest.fn(),
  },
  runtime: {
    getURL: jest.fn()
  },
  scripting: {
    executeScript: jest.fn()
  }
};

describe('TabManager', () => {
  let tabManager;
  let storageManager;

  beforeEach(() => {
    storageManager = new StorageManager();
    tabManager = new TabManager(storageManager);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('shouldSuspendTab', () => {
    it('should not suspend pinned tabs', async () => {
      const tab = { id: 1, pinned: true };
      const result = await tabManager.shouldSuspendTab(tab);
      expect(result).toBe(false);
    });

    it('should not suspend audible tabs', async () => {
      const tab = { id: 1, audible: true };
      const result = await tabManager.shouldSuspendTab(tab);
      expect(result).toBe(false);
    });

    it('should not suspend active tabs', async () => {
      const tab = { id: 1, active: true };
      const result = await tabManager.shouldSuspendTab(tab);
      expect(result).toBe(false);
    });
  });

  describe('isTabSuspended', () => {
    it('should return true for suspended tabs', () => {
      chrome.runtime.getURL.mockReturnValue('chrome-extension://suspended/suspended.html');
      const tab = { url: 'chrome-extension://suspended/suspended.html?url=https://example.com' };
      expect(tabManager.isTabSuspended(tab)).toBe(true);
    });

    it('should return false for regular tabs', () => {
      chrome.runtime.getURL.mockReturnValue('chrome-extension://suspended/suspended.html');
      const tab = { url: 'https://example.com' };
      expect(tabManager.isTabSuspended(tab)).toBe(false);
    });
  });
});
