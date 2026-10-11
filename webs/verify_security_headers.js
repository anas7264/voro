import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=========================================");
console.log("🧪 RUNNING SECURITY VERIFICATION: HTTP SECURITY HEADERS");
console.log("=========================================");

let passed = true;

// 1. Verify vite.config.js headers
const viteConfigPath = path.join(__dirname, 'vite.config.js');
const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');

const expectedHeaders = [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Resource-Policy',
  'Strict-Transport-Security'
];

console.log("🟢 Checking vite.config.js for server & preview security headers...");
for (const header of expectedHeaders) {
  if (viteConfigContent.includes(header)) {
    console.log(`  ✅ Found header: ${header}`);
  } else {
    console.error(`  ❌ Missing header in vite.config.js: ${header}`);
    passed = false;
  }
}

if (viteConfigContent.includes('server:') && viteConfigContent.includes('preview:')) {
  console.log("  ✅ Configured for both server and preview environments");
} else {
  console.error("  ❌ Missing server or preview configuration in vite.config.js");
  passed = false;
}

// 2. Verify index.html meta tags
const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const expectedMetaHeaders = [
  'Content-Security-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Permissions-Policy'
];

console.log("\n🟢 Checking index.html for security policy meta tags...");
for (const header of expectedMetaHeaders) {
  if (indexHtmlContent.includes(`http-equiv="${header}"`)) {
    console.log(`  ✅ Found meta http-equiv tag: ${header}`);
  } else {
    console.error(`  ❌ Missing meta http-equiv tag in index.html: ${header}`);
    passed = false;
  }
}

console.log("\n=========================================");
if (passed) {
  console.log("🎉 ALL HTTP SECURITY HEADER VERIFICATION TESTS PASSED!");
} else {
  console.error("❌ SECURITY HEADER VERIFICATION FAILED!");
  process.exit(1);
}
console.log("=========================================");
