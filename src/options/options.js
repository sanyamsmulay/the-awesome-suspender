document.addEventListener('DOMContentLoaded', async () => {
  // Tab navigation
  const navLinks = document.querySelectorAll('.nav-links a');
  const tabContents = document.querySelectorAll('.tab-content');

  // Load current settings
  const loadSettings = async () => {
    const settings = await chrome.storage.sync.get('settings');
    const defaultSettings = {
      timeout: 30,
      autoUnsuspend: true,
      useDiscardAPI: false,
      showContextMenu: true,
      theme: 'system',
      neverSuspendPinned: true,
      neverSuspendForms: true,
      neverSuspendAudio: true,
      neverSuspendActive: true,
      neverSuspendOffline: true,
      whitelistedUrls: []
    };

    const currentSettings = { ...defaultSettings, ...settings.settings };

    // Update form values
    document.getElementById('timeout').value = currentSettings.timeout;
    document.getElementById('auto-unsuspend').checked = currentSettings.autoUnsuspend;
    document.getElementById('discard-api').checked = currentSettings.useDiscardAPI;
    document.getElementById('context-menu').checked = currentSettings.showContextMenu;
    document.getElementById('theme').value = currentSettings.theme;
    document.getElementById('never-suspend-pinned').checked = currentSettings.neverSuspendPinned;
    document.getElementById('never-suspend-forms').checked = currentSettings.neverSuspendForms;
    document.getElementById('never-suspend-audio').checked = currentSettings.neverSuspendAudio;
    document.getElementById('never-suspend-active').checked = currentSettings.neverSuspendActive;
    document.getElementById('never-suspend-offline').checked = currentSettings.neverSuspendOffline;
    document.getElementById('whitelist').value = currentSettings.whitelistedUrls.join('\n');
  };

  // Save settings
  const saveSettings = async () => {
    const settings = {
      timeout: parseInt(document.getElementById('timeout').value, 10),
      autoUnsuspend: document.getElementById('auto-unsuspend').checked,
      useDiscardAPI: document.getElementById('discard-api').checked,
      showContextMenu: document.getElementById('context-menu').checked,
      theme: document.getElementById('theme').value,
      neverSuspendPinned: document.getElementById('never-suspend-pinned').checked,
      neverSuspendForms: document.getElementById('never-suspend-forms').checked,
      neverSuspendAudio: document.getElementById('never-suspend-audio').checked,
      neverSuspendActive: document.getElementById('never-suspend-active').checked,
      neverSuspendOffline: document.getElementById('never-suspend-offline').checked,
      whitelistedUrls: document.getElementById('whitelist').value
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)
    };

    await chrome.storage.sync.set({ settings });

    // Show save message
    saveMessage.classList.add('visible');
    setTimeout(() => {
      saveMessage.classList.remove('visible');
    }, 2000);

    // Notify background script of settings change
    chrome.runtime.sendMessage({ action: 'settingsUpdated' });
  };

  // Handle tab navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);

      // Update active states
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show/hide tab content
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
          if (targetId === 'session-management') {
            updateTabSummary(); // Update tab summary when switching to session management
          }
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // Update tab summary
  const updateTabSummary = async () => {
    const tabSummary = document.getElementById('tab-summary');
    const windowsList = document.getElementById('windows-list');
    const windows = await chrome.windows.getAll({ populate: true });
    
    // Count total tabs
    const totalTabs = windows.reduce((sum, window) => sum + window.tabs.length, 0);
    
    // Format current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();
    
    // Update summary
    const sessionInfo = tabSummary.querySelector('.session-info');
    const sessionStats = tabSummary.querySelector('.session-stats');
    
    if (sessionInfo) {
      sessionInfo.textContent = `Last updated: ${day} ${month} ${year} ${formattedHours}:${formattedMinutes}${ampm}`;
    }
    
    if (sessionStats) {
      sessionStats.textContent = `(${windows.length} windows, ${totalTabs} tabs)`;
    }

    // Make summary clickable
    tabSummary.style.cursor = 'pointer';
    tabSummary.addEventListener('click', () => {
      windowsList.classList.toggle('expanded');
      updateWindowsList(windows);
    });
  };

  // Update windows list
  const updateWindowsList = (windows) => {
    const windowsList = document.getElementById('windows-list');
    windowsList.innerHTML = '';

    windows.forEach((window, windowIndex) => {
      const windowElement = document.createElement('div');
      windowElement.className = 'window-item';
      
      // Create window header
      const windowHeader = document.createElement('div');
      windowHeader.className = 'window-header';
      windowHeader.innerHTML = `
        <div class="window-info">
          <span class="window-number">#${windowIndex + 1}</span>
          <span>Window</span>
        </div>
        <span class="window-stats">${window.tabs.length} tabs</span>
      `;

      // Create tabs list container
      const tabsList = document.createElement('div');
      tabsList.className = 'tabs-list';

      // Add tabs to the list
      window.tabs.forEach((tab, tabIndex) => {
        const tabElement = document.createElement('div');
        tabElement.className = 'tab-item';
        tabElement.innerHTML = `
          <span class="tab-number">#${tabIndex + 1}</span>
          <img src="${tab.favIconUrl || '/icons/icon16.png'}" class="tab-favicon" alt="Favicon">
          <span class="tab-title">${tab.title}</span>
          <div class="tab-actions">
            <span class="tab-action" title="Focus tab">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L14 8L8 13V3Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
        `;

        // Add click handlers
        const tabTitle = tabElement.querySelector('.tab-title');
        tabTitle.addEventListener('click', () => {
          chrome.tabs.create({ url: tab.url });
        });

        const focusAction = tabElement.querySelector('.tab-action');
        focusAction.addEventListener('click', (e) => {
          e.stopPropagation();
          chrome.windows.update(window.id, { focused: true });
          chrome.tabs.update(tab.id, { active: true });
        });

        tabsList.appendChild(tabElement);
      });

      // Toggle tabs list visibility
      windowHeader.addEventListener('click', () => {
        tabsList.classList.toggle('expanded');
      });

      windowElement.appendChild(windowHeader);
      windowElement.appendChild(tabsList);
      windowsList.appendChild(windowElement);
    });
  };

  // Initial tab summary update
  updateTabSummary();

  // Update tab summary periodically
  setInterval(updateTabSummary, 5000); // Update every 5 seconds

  // Handle Import Session button
  const importButton = document.querySelector('.session-actions .action-button');
  if (importButton) {
    importButton.addEventListener('click', () => {
      // TODO: Implement session import functionality
      console.log('Import session clicked');
    });
  }

  // Handle Migrate Tabs button
  const migrateButton = document.querySelector('.migration-section .action-button');
  if (migrateButton) {
    migrateButton.addEventListener('click', () => {
      const extensionId = document.querySelector('.input-group input').value;
      // TODO: Implement tab migration functionality
      console.log('Migrate tabs clicked with extension ID:', extensionId);
    });
  }
});
