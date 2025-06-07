document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settings-form');
  const saveMessage = document.querySelector('.save-message');

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

  // Load initial settings
  await loadSettings();

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });

  // Handle theme changes
  document.getElementById('theme').addEventListener('change', (e) => {
    const theme = e.target.value;
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
});
