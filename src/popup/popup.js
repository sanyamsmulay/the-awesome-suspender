document.addEventListener('DOMContentLoaded', async () => {
  // Get UI elements
  const suspendedCount = document.getElementById('suspended-count');
  const memorySaved = document.getElementById('memory-saved');
  const toggleTab = document.getElementById('toggle-tab');
  const suspendOthers = document.getElementById('suspend-others');
  const suspendAll = document.getElementById('suspend-all');
  const unsuspendAll = document.getElementById('unsuspend-all');
  const openOptions = document.getElementById('open-options');

  // Update stats
  const updateStats = async () => {
    const tabs = await chrome.tabs.query({});
    const suspendedTabs = tabs.filter(tab => 
      tab.url.startsWith(chrome.runtime.getURL('suspended/suspended.html'))
    );
    
    suspendedCount.textContent = suspendedTabs.length;
    
    // Estimate memory saved (rough estimate: 100MB per suspended tab)
    const savedMB = suspendedTabs.length * 100;
    memorySaved.textContent = `${savedMB} MB`;
  };

  // Initial stats update
  await updateStats();

  // Add button listeners
  toggleTab.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.runtime.sendMessage({ action: 'toggleSuspension', tabId: tab.id });
    window.close();
  });

  suspendOthers.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ action: 'suspendOthers' });
    window.close();
  });

  suspendAll.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ action: 'suspendAll' });
    window.close();
  });

  unsuspendAll.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ action: 'unsuspendAll' });
    window.close();
  });

  openOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });
});
