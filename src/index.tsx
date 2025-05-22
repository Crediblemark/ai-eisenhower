import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Service Worker Registration with Update Handling
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported by this browser');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none',
      scope: '/'
    });

    console.log('ServiceWorker registration successful with scope: ', registration.scope);

    // Track updates across page reloads
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      console.log('New service worker found, installing...');
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content is available; please refresh.');
          }
        });
      }
    });

    // Check for updates periodically
    setInterval(() => {
      registration.update().catch(err => 
        console.log('Error checking for updates:', err)
      );
    }, 60 * 60 * 1000); // Check every hour

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        // When the new worker is installed and waiting, prompt user to update
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New content is available; please refresh.');
          
          // You can customize this to show a UI notification instead
          if (window.confirm('A new version is available. Would you like to update now?')) {
            // Send a message to the service worker to skip waiting
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      });
    });
  } catch (error) {
    console.error('ServiceWorker registration failed: ', error);
  }
};

// Register service worker when DOM is fully loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}

// Handle offline/online status
const updateOnlineStatus = () => {
  const status = document.getElementById('online-status');
  if (status) {
    const isOnline = navigator.onLine;
    status.textContent = isOnline ? 'Online' : 'Offline';
    status.className = `status ${isOnline ? 'online' : 'offline'}`;
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('app:status', { detail: { online: isOnline } }));
    
    // If coming back online, try to sync data
    if (isOnline) {
      console.log('Back online, checking for updates...');
      
      // Check for service worker updates
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SYNC_DATA' });
      }
    }
  }
};

// Initial status check
updateOnlineStatus();

// Listen for connection changes
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Listen for messages from service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message from service worker:', event.data);
    
    if (event.data && event.data.type === 'REFRESH_PAGE') {
      window.location.reload();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
