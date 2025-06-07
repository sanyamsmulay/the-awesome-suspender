export class StorageManager {
  constructor() {
    this.defaultSettings = {
      autoSuspendTimeout: 1800000, // 30 minutes
      autoUnsuspend: true,
      useDiscardAPI: false,
      whitelistedUrls: [],
      theme: 'light',
      showContextMenu: true
    };
  }

  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AwesomeSuspender', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'timestamp' });
          sessionsStore.createIndex('date', 'date');
        }
      };
    });
  }

  async getSettings() {
    const result = await chrome.storage.sync.get('settings');
    return { ...this.defaultSettings, ...result.settings };
  }

  async updateSettings(settings) {
    await chrome.storage.sync.set({
      settings: { ...await this.getSettings(), ...settings }
    });
  }

  async saveSession(session) {
    const db = await this.initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');

      const request = store.add({
        ...session,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSessions(days = 30) {
    const db = await this.initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const dateIndex = store.index('date');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const request = dateIndex.getAll(IDBKeyRange.lowerBound(startDate.toISOString().split('T')[0]));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupOldSessions() {
    const db = await this.initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const dateIndex = store.index('date');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const request = dateIndex.delete(IDBKeyRange.upperBound(thirtyDaysAgo.toISOString().split('T')[0]));

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
