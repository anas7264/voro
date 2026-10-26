// Security & Integrity Verification: Async Storage Purge & Reset Synchronization
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=========================================");
console.log("🧪 RUNNING VERIFICATION: ASYNC STORAGE PURGE & RESET");
console.log("=========================================");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ Test ${totalTests}: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ Test ${totalTests} FAILED: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Inspect StorageContext.jsx for async deleteItem and clearAllData
const storageContextPath = path.join(__dirname, 'src/context/StorageContext.jsx');
const storageContextSrc = fs.readFileSync(storageContextPath, 'utf8');

assert(
  storageContextSrc.includes('deleteItem = useCallback(async (key) =>') &&
  storageContextSrc.includes('return await storage.delete(key)'),
  "StorageContext.deleteItem is an async function that awaits storage.delete(key)"
);

assert(
  storageContextSrc.includes('clearAllData = useCallback(async () =>') &&
  storageContextSrc.includes('return await storage.clear()'),
  "StorageContext.clearAllData is an async function that awaits storage.clear()"
);

// 2. Inspect AppContext.jsx for async resetAppState
const appContextPath = path.join(__dirname, 'src/context/AppContext.jsx');
const appContextSrc = fs.readFileSync(appContextPath, 'utf8');

assert(
  appContextSrc.includes('resetAppState = useCallback(async () =>') &&
  appContextSrc.includes('await storage.clear()'),
  "AppContext.resetAppState is an async function that awaits storage.clear()"
);

// 3. Inspect Settings.jsx for handleClearData awaiting clearAllData
const settingsPath = path.join(__dirname, 'src/pages/Settings.jsx');
const settingsSrc = fs.readFileSync(settingsPath, 'utf8');

assert(
  settingsSrc.includes('handleClearData = useCallback(async () =>') &&
  settingsSrc.includes('await clearAllData()'),
  "Settings.handleClearData is an async handler that awaits clearAllData()"
);

console.log("\n-----------------------------------------");
console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log("🎉 ALL ASYNC STORAGE PURGE VERIFICATION CHECKS PASSED!");
} else {
  console.error("⚠️ SOME ASYNC STORAGE PURGE VERIFICATION CHECKS FAILED!");
}
console.log("=========================================\n");
