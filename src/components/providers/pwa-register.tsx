"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      window.dispatchEvent(new CustomEvent("pwa-installable"));
      console.log("[Kosha PWA] App is ready to be installed.");
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[Kosha PWA] Service worker registered:", registration.scope);

            // Check for updates every 60 seconds
            setInterval(() => {
              registration.update();
            }, 60_000);

            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    // New content is available; let the user know
                    console.log("[Kosha PWA] New version available!");
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn("[Kosha PWA] Service worker registration failed:", err);
          });
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  return null;
}
