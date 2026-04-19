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

// Install prompt is intentionally disabled for this project.
// Keep service workers unregistered in every environment.
const shouldEnableServiceWorker = false;

if (shouldEnableServiceWorker) {
  registerServiceWorker().catch((err) =>
    console.error("Service Worker registration failed:", err)
  );
} else {
  unregisterServiceWorker().catch((err) =>
    console.error("Service Worker unregistration failed:", err)
  );
}
