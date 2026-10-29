import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=========================================");
console.log("⚡ VERIFYING ASYNC STORAGE PURGE OPERATIONS");
console.log("=========================================");

const storageContextPath = path.resolve(__dirname, 'src/context/StorageContext.jsx');
const appContextPath = path.resolve(__dirname, 'src/context/AppContext.jsx');
const settingsPagePath = path.resolve(__dirname, 'src/pages/Settings.jsx');

// 🧪 Test 1: Verify StorageContext deleteItem & clearAllData are async and await storage operations
console.log("🧪 Test 1: Verifying StorageContext deleteItem & clearAllData use async/await...");
const storageContextContent = fs.readFileSync(storageContextPath, 'utf8');

if (!storageContextContent.includes('const deleteItem = useCallback(async (key) =>')) {
  console.error("❌ Error: deleteItem in StorageContext is not declared as an async function!");
  process.exit(1);
}

if (!storageContextContent.includes('return await storage.delete(key);')) {
  console.error("❌ Error: deleteItem does not await storage.delete(key)!");
  process.exit(1);
}

if (!storageContextContent.includes('const clearAllData = useCallback(async () =>')) {
  console.error("❌ Error: clearAllData in StorageContext is not declared as an async function!");
  process.exit(1);
}

if (!storageContextContent.includes('return await storage.clear();')) {
  console.error("❌ Error: clearAllData does not await storage.clear()!");
  process.exit(1);
}
console.log("✅ Success: StorageContext async deleteItem and clearAllData verified!");

// 🧪 Test 2: Verify AppContext resetAppState is async and awaits storage.clear()
console.log("\n🧪 Test 2: Verifying AppContext resetAppState uses async/await...");
const appContextContent = fs.readFileSync(appContextPath, 'utf8');

if (!appContextContent.includes('const resetAppState = useCallback(async () =>')) {
  console.error("❌ Error: resetAppState in AppContext is not declared as an async function!");
  process.exit(1);
}

if (!appContextContent.includes('await storage.clear();')) {
  console.error("❌ Error: resetAppState does not await storage.clear()!");
  process.exit(1);
}
console.log("✅ Success: AppContext async resetAppState verified!");

// 🧪 Test 3: Verify Settings handleClearData awaits clearAllData()
console.log("\n🧪 Test 3: Verifying Settings handleClearData awaits clearAllData()...");
const settingsPageContent = fs.readFileSync(settingsPagePath, 'utf8');

if (!settingsPageContent.includes('const handleClearData = useCallback(async () =>')) {
  console.error("❌ Error: handleClearData in Settings.jsx is not declared as an async function!");
  process.exit(1);
}

if (!settingsPageContent.includes('const success = await clearAllData();')) {
  console.error("❌ Error: handleClearData does not await clearAllData()!");
  process.exit(1);
}
console.log("✅ Success: Settings handleClearData await clearAllData() verified!");

console.log("=========================================");
console.log("🎉 ALL ASYNC STORAGE PURGE CHECKS PASSED!");
console.log("=========================================");
