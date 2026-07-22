let deferredPrompt;
const installPromptDismissed = localStorage.getItem("installPromptDismissed");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (!installPromptDismissed) {
    showInstallPrompt();
  }
});

function showInstallPrompt() {
  const prompt = document.createElement("div");
  prompt.className = "install-prompt";
  prompt.innerHTML = `
        <div class="install-prompt-text">
            <div class="install-prompt-title">📱 نصب اپلیکیشن</div>
        </div>
        <button class="install-btn" id="installBtn">نصب</button>
        <button class="close-install" id="closeInstall">✕</button>
    `;
  document.body.appendChild(prompt);

  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }

    deferredPrompt = null;
    prompt.remove();
  });

  document.getElementById("closeInstall").addEventListener("click", () => {
    localStorage.setItem("installPromptDismissed", "true");
    prompt.remove();
  });
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  let newWorker;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Listen for waiting worker
        registration.addEventListener("updatefound", () => {
          newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker is ready
              showUpdateNotification();
            }
          });
        });
      })
      .catch((err) => {
        console.log("SW registration failed:", err);
      });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        showUpdateNotification();
      }
    });

    // Handle controller change
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  });

  // Show update notification
  function showUpdateNotification() {
    const notification = document.getElementById("updateNotification");
    if (notification) {
      notification.classList.remove("hidden");
      notification.classList.add("show");
    }
  }

  // Handle update button click
  document.addEventListener("DOMContentLoaded", () => {
    const updateButton = document.getElementById("updateButton");
    const dismissButton = document.getElementById("dismissUpdate");
    const notification = document.getElementById("updateNotification");

    if (updateButton) {
      updateButton.addEventListener("click", () => {
        // Clear all caches and reload
        if ("caches" in window) {
          caches
            .keys()
            .then((names) => {
              names.forEach((name) => {
                caches.delete(name);
              });
            })
            .then(() => {
              // Tell the service worker to skip waiting
              if (newWorker) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
              } else {
                window.location.reload();
              }
            });
        } else {
          window.location.reload();
        }
      });
    }

    if (dismissButton) {
      dismissButton.addEventListener("click", () => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
      });
    }
  });
}

// Handle app installation
window.addEventListener("appinstalled", () => {
  console.log("App installed successfully");
  deferredPrompt = null;
});
