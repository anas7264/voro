/**
 * Secure Error Boundary verification test suite
 * Verifies information leakage mitigation, secret redaction, RASP active analysis,
 * and 3D hover/focus interaction patterns in webs/src/components/ErrorBoundary.jsx
 */

import './mock_window.js';
import React from 'react';

// Create a mock of React globally if needed, or mock components.
const originalDefineProperty = Object.defineProperty;
originalDefineProperty(global, 'React', {
  value: {
    Component: class Component {
      constructor(props) {
        this.props = props;
        this.state = {};
      }
      setState(updater) {
        const nextState = typeof updater === 'function' ? updater(this.state) : updater;
        this.state = { ...this.state, ...nextState };
      }
    },
    createRef: () => ({ current: null })
  },
  configurable: true,
  writable: true
});

import { ErrorBoundary } from './src/components/ErrorBoundary.jsx';

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING SECURITY VERIFICATION: SECURE ERROR BOUNDARY");
  console.log("=========================================");

  // Reset compromise state
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  console.log("🟢 Test 1: Verifying information leakage mitigation and secret redaction...");

  // Instantiate ErrorBoundary directly to test its internal logic
  const boundaryInstance = new ErrorBoundary({ children: "Secure Content" });

  // Override setState on the instance to allow state updates on unmounted mock instances
  boundaryInstance.setState = function(updater) {
    const nextState = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...nextState };
  };

  // Set the error state
  boundaryInstance.state = {
    hasError: true,
    error: new Error("Placeholder")
  };

  // Set the sensitive error message
  const sensitiveMessage = "Failure connecting to Claude at sk-ant-api03-abcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678912345 for user elite.hacker@voro.security (stripe key sk_live_12345ABCDE, jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c, uuid a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d)";
  boundaryInstance.state.error = new Error(sensitiveMessage);

  // We can mock a few refs and options.
  boundaryInstance.buttonRef = {
    current: {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 50 }),
      style: {
        setProperty: function(name, val) {
          boundaryInstance.buttonRef.current[name] = val;
        }
      }
    }
  };
  boundaryInstance.txRef = { current: { innerText: "" } };
  boundaryInstance.tyRef = { current: { innerText: "" } };

  // Call render
  const renderedTree = boundaryInstance.render();

  // We can check if any secret is leaked or if the error is redacted correctly.
  const stringifyElement = (element) => {
    if (!element) return "";
    if (typeof element === "string") return element;
    if (Array.isArray(element)) return element.map(stringifyElement).join(" ");
    let text = "";
    if (element.props) {
      if (element.props.children) {
        text += " " + stringifyElement(element.props.children);
      }
      if (element.props.error) {
        text += " " + stringifyElement(element.props.error.message || element.props.error);
      }
    }
    return text;
  };

  const outputText = stringifyElement(renderedTree);
  console.log("Scrubbed text preview in error UI:", outputText);

  // Assertions
  const prohibitedTokens = [
    "sk-ant-api03-",
    "elite.hacker@voro.security",
    "sk_live_12345ABCDE",
    "eyJhbGci",
    "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
  ];

  for (const token of prohibitedTokens) {
    if (outputText.includes(token)) {
      throw new Error(`❌ Failure: Sensitive token '${token}' leaked in rendered error view!`);
    }
  }

  console.log("✅ Success: All sensitive credentials, PII, and UUIDs successfully redacted.");

  // --- TEST 2: RASP Security Integration ---
  console.log("\n🛡️ Test 2: Verifying RASP security integration on malicious crashes...");

  // Reset VORO_COMPROMISED
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  // Simulate a malicious prototype pollution crash
  const maliciousError = new Error("Cannot assign to __proto__ of secure state ledger");
  boundaryInstance.componentDidCatch(maliciousError, { componentStack: "at Settings (Settings.jsx)" });

  if (window.VORO_COMPROMISED && window.VORO_DECEPTION_ACTIVE) {
    console.log("✅ Success: Malicious prototype pollution crash successfully detected and locked down!");
  } else {
    throw new Error("❌ Failure: Malicious prototype pollution was not detected by RASP Error Boundary!");
  }

  // Test other RASP signatures
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;
  const bypassError = new Error("Attempting to override system instructions via malicious payload");
  boundaryInstance.componentDidCatch(bypassError, { componentStack: "at AICoach (AICoach.jsx)" });

  if (window.VORO_COMPROMISED && window.VORO_DECEPTION_ACTIVE) {
    console.log("✅ Success: Malicious system instruction override bypass successfully caught and locked down!");
  } else {
    throw new Error("❌ Failure: Malicious instruction override was not caught by RASP Error Boundary!");
  }

  // --- TEST 3: Volumetric Tilt Interactions ---
  console.log("\n🏃 Test 3: Verifying Accessible 3D Interaction and direct DOM telemetry patterns...");

  // Reset compromise state from previous tests so active interaction is allowed
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  // Simulate focus
  boundaryInstance.handleFocus();
  if (boundaryInstance.state.isFocused) {
    console.log("✅ Success: Focus state applied.");
  } else {
    throw new Error("❌ Failure: Focus state not set!");
  }

  // Check 4-degree static tilt on focus
  const tiltX = boundaryInstance.buttonRef.current["--tilt-x"];
  const tiltY = boundaryInstance.buttonRef.current["--tilt-y"];
  if (tiltX === "4deg" && tiltY === "-4deg") {
    console.log("✅ Success: Applied 4-degree keyboard-focus tilt correctly.");
  } else {
    throw new Error(`❌ Failure: Focus tilt incorrect! tiltX=${tiltX}, tiltY=${tiltY}`);
  }

  // Simulate mouse move
  boundaryInstance.handleMouseMove({ clientX: 100, clientY: 25 });
  const mouseX = boundaryInstance.buttonRef.current["--mouse-x"];
  const mouseY = boundaryInstance.buttonRef.current["--mouse-y"];
  if (mouseX && mouseY) {
    console.log(`✅ Success: Mouse coordinates computed (X: ${mouseX}, Y: ${mouseY}).`);
  } else {
    throw new Error("❌ Failure: Mouse tracking did not update DOM properties!");
  }

  console.log("\n🎉 ALL SECURE ERROR BOUNDARY SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error("❌ Test Runner encountered an error:", err);
  process.exit(1);
});
