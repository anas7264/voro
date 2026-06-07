import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { performIntegrityCheck, startSecurityHeartbeat } from "./utils/security";

// Execute VORO Neural Shield: Runtime Integrity Attestation
performIntegrityCheck();

// Start background security monitoring
startSecurityHeartbeat();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
