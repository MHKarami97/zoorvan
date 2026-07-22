---
---
// assets/js/pwa.js — ثبت Service Worker و مدیریت پرامپت نصب PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("{{ '/sw.js' | relative_url }}")
      .then(function (reg) {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch(function (err) {
        console.warn("Service Worker registration failed:", err);
      });
  });
}

// نمایش دکمه نصب سفارشی (طبق معیارهای نصب PWA در web.dev/articles/install-criteria)
let deferredPrompt;
const installBtn = document.querySelector("[data-pwa-install]");

window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

window.addEventListener("appinstalled", function () {
  if (installBtn) installBtn.hidden = true;
  console.log("PWA نصب شد");
});
