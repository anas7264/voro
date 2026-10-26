import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=========================================');
console.log('🧪 VERIFYING ASYNC STORAGE PURGE OPERATIONS');
console.log('=========================================\n');

let passed = true;

// 1. Verify StorageContext.jsx source code
console.log('🟢 Test 1: Verifying StorageContext.jsx async deleteItem & clearAllData...');
const storageContextPath = path.resolve(__dirname, 'src/context/StorageContext.jsx');
const storageContextCode = fs.readFileSync(storageContextPath, 'utf8');

if (!storageContextCode.includes('deleteItem = useCallback(async (key) =>')) {
  console.error('❌ Failure: deleteItem in StorageContext.jsx is not declared async');
  passed = false;
}
if (!storageContextCode.includes('return await storage.delete(key);')) {
  console.error('❌ Failure: deleteItem does not await storage.delete(key)');
  passed = false;
}
if (!storageContextCode.includes('clearAllData = useCallback(async () =>')) {
  console.error('❌ Failure: clearAllData in StorageContext.jsx is not declared async');
  passed = false;
}
if (!storageContextCode.includes('return await storage.clear();')) {
  console.error('❌ Failure: clearAllData does not await storage.clear()');
  passed = false;
}
if (passed) {
  console.log('✅ Success: StorageContext.jsx async purge signatures verified!');
}

// 2. Verify AppContext.jsx source code
console.log('\n🟢 Test 2: Verifying AppContext.jsx async resetAppState...');
const appContextPath = path.resolve(__dirname, 'src/context/AppContext.jsx');
const appContextCode = fs.readFileSync(appContextPath, 'utf8');

if (!appContextCode.includes('resetAppState = useCallback(async () =>')) {
  console.error('❌ Failure: resetAppState in AppContext.jsx is not declared async');
  passed = false;
}
if (!appContextCode.includes('await storage.clear();')) {
  console.error('❌ Failure: resetAppState does not await storage.clear()');
  passed = false;
}
if (passed) {
  console.log('✅ Success: AppContext.jsx async resetAppState verified!');
}

// 3. Verify Settings.jsx source code
console.log('\n🟢 Test 3: Verifying Settings.jsx async handleClearData...');
const settingsPath = path.resolve(__dirname, 'src/pages/Settings.jsx');
const settingsCode = fs.readFileSync(settingsPath, 'utf8');

if (!settingsCode.includes('handleClearData = useCallback(async () =>')) {
  console.error('❌ Failure: handleClearData in Settings.jsx is not declared async');
  passed = false;
}
if (!settingsCode.includes('const success = await clearAllData();')) {
  console.error('❌ Failure: handleClearData does not await clearAllData()');
  passed = false;
}
if (passed) {
  console.log('✅ Success: Settings.jsx async handleClearData verified!');
}

console.log('\n=========================================');
if (passed) {
  console.log('🎉 ALL ASYNC STORAGE PURGE VERIFICATION TESTS PASSED!');
  console.log('=========================================\n');
  process.exit(0);
} else {
  console.error('💥 SOME TESTS FAILED!');
  console.log('=========================================\n');
  process.exit(1);
}
