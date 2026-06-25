import { startSecurityHeartbeat } from "./utils/security";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Start background security monitoring
startSecurityHeartbeat();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
