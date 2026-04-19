import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  registerServiceWorker,
  unregisterServiceWorker,
} from "./lib/serviceWorkerRegistration";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep behavior deterministic across environments.
// Enable service worker only when explicitly requested.
const shouldEnableServiceWorker =
  import.meta.env.PROD && import.meta.env.VITE_ENABLE_SERVICE_WORKER === "true";

if (shouldEnableServiceWorker) {
  registerServiceWorker().catch((err) =>
    console.error("Service Worker registration failed:", err)
  );
} else {
  unregisterServiceWorker().catch((err) =>
    console.error("Service Worker unregistration failed:", err)
  );
}
