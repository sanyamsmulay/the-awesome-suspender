document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const originalUrl = params.get('url');
  const originalTitle = params.get('title');

  // Update page title and URL display
  document.title = `Suspended: ${originalTitle}`;
  document.getElementById('suspended-url').textContent = originalUrl;

  // Handle mascot click
  const mascot = document.getElementById('mascot');
  let isAwake = false;

  const toggleMascot = () => {
    isAwake = !isAwake;
    mascot.src = `../icons/mascot-${isAwake ? 'awake' : 'sleeping'}.svg`;
    
    if (isAwake) {
      // Wait 3 seconds then go back
      setTimeout(() => {
        window.history.back();
      }, 3000);
    }
  };

  // Add click listeners
  mascot.addEventListener('click', toggleMascot);
  document.body.addEventListener('click', (e) => {
    if (e.target !== mascot) {
      window.history.back();
    }
  });
});
