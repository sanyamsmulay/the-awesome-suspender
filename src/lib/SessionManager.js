export class SessionManager {
  constructor(storageManager) {
    this.storage = storageManager;
    this.setupDailyBackup();
  }

  setupDailyBackup() {
    // Schedule backup for midnight
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // next day
      0, // midnight
      0, // 0 minutes
      0 // 0 seconds
    );
    
    const msUntilMidnight = night.getTime() - now.getTime();
    
    // Set up initial backup
    setTimeout(() => {
      this.backupCurrentSession();
      // Then set up daily interval
      setInterval(() => this.backupCurrentSession(), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  async getCurrentSession() {
    const windows = await chrome.windows.getAll({ populate: true });
    const session = {
      windows: windows.map(window => ({
        id: window.id,
        tabs: window.tabs.map(tab => ({
          id: tab.id,
          url: tab.url,
          title: tab.title,
          pinned: tab.pinned,
          suspended: tab.url.startsWith(chrome.runtime.getURL('suspended/suspended.html'))
        }))
      })),
      timestamp: Date.now()
    };
    return session;
  }

  async backupCurrentSession() {
    const session = await this.getCurrentSession();
    await this.storage.saveSession(session);
    await this.storage.cleanupOldSessions();
  }

  async getSessionHistory(days = 30) {
    return await this.storage.getSessions(days);
  }

  async exportSession(session) {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const date = new Date(session.timestamp).toISOString().split('T')[0];
    const filename = `awesome-suspender-session-${date}.json`;
    
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
    
    URL.revokeObjectURL(url);
  }

  async restoreSession(session) {
    for (const window of session.windows) {
      const newWindow = await chrome.windows.create({
        url: window.tabs[0].url,
        focused: false
      });
      
      // Skip first tab as it was created with the window
      for (let i = 1; i < window.tabs.length; i++) {
        const tab = window.tabs[i];
        await chrome.tabs.create({
          windowId: newWindow.id,
          url: tab.url,
          pinned: tab.pinned
        });
      }
    }
  }
}
