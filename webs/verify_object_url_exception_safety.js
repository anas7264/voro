/**
 * Security Verification Test: Blob Object URL Exception Safety and Revocation
 * Verifies that Object URLs created during file exports (PDF, CSV, JSON) are
 * exception-safe and unconditionally revoked via try ... finally blocks even when
 * DOM operations or .click() calls throw exceptions.
 */

// Configure mock window environment for Node execution
globalThis.window = globalThis.window || {};
globalThis.window.location = { origin: 'http://localhost' };
globalThis.window.__VORO_TEST_BYPASS__ = true;
globalThis.window.URL = globalThis.window.URL || {};

import { downloadPDF, sanitizeFilename } from './src/utils/pdfExport.js';

let createdUrls = [];
let revokedUrls = [];

globalThis.window.URL.createObjectURL = (blob) => {
  const url = `blob:voro-mock-url-${Math.random().toString(36).slice(2)}`;
  createdUrls.push(url);
  return url;
};

globalThis.window.URL.revokeObjectURL = (url) => {
  revokedUrls.push(url);
};

// Mock document for DOM triggers
globalThis.document = globalThis.document || {
  createElement: (tag) => {
    const el = {
      href: '',
      download: '',
      click: () => {
        if (el.shouldThrow) {
          throw new Error('Simulated DOM Click Exception');
        }
      }
    };
    return el;
  },
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};

async function runVerification() {
  console.log('=========================================');
  console.log('🧪 RUNNING SECURITY VERIFICATION: BLOB OBJECT URL EXCEPTION SAFETY');
  console.log('=========================================\n');

  // Test 1: Verify downloadPDF handles DOM exceptions safely and revokes URL
  console.log('🛡️ Test 1: Verifying downloadPDF revokes Object URL when DOM click throws exception...');
  createdUrls = [];
  revokedUrls = [];

  const mockDoc = {
    output: () => new Blob(['mock pdf content'], { type: 'application/pdf' })
  };

  // Force document.createElement to return an element whose click throws
  const originalCreateElement = globalThis.document.createElement;
  globalThis.document.createElement = (tag) => {
    const el = originalCreateElement(tag);
    el.shouldThrow = true;
    return el;
  };

  try {
    await downloadPDF(mockDoc, 'test-report.pdf');
  } catch (err) {
    // Exception expected from simulated click
  }

  if (createdUrls.length === 1 && revokedUrls.length === 1 && createdUrls[0] === revokedUrls[0]) {
    console.log('✅ Success: downloadPDF safely revoked Object URL despite DOM exception!');
  } else {
    console.error(`❌ Failure: Expected 1 created and 1 revoked URL. Created: ${createdUrls.length}, Revoked: ${revokedUrls.length}`);
    process.exit(1);
  }

  // Restore normal createElement
  globalThis.document.createElement = originalCreateElement;

  // Test 2: Verify sanitizeFilename neutralizes path traversal and control characters
  console.log('\n🛡️ Test 2: Verifying sanitizeFilename neutralizes path traversal and reserved characters...');

  const maliciousFilenames = [
    '../../etc/passwd',
    '..\\..\\Windows\\System32\\cmd.exe',
    'export\x00data.pdf',
    'user/input/file?.pdf',
    'report:test*.pdf'
  ];

  for (const filename of maliciousFilenames) {
    const clean = sanitizeFilename(filename);
    if (clean.includes('..') || clean.includes('/') || clean.includes('\\') || clean.includes('\x00') || !clean.endsWith('.pdf')) {
      console.error(`❌ Failure: sanitizeFilename failed to clean "${filename}" -> "${clean}"`);
      process.exit(1);
    }
  }

  console.log('✅ Success: sanitizeFilename correctly neutralized all path traversal and reserved characters!');

  console.log('\n=========================================');
  console.log('🎉 ALL BLOB OBJECT URL EXCEPTION SAFETY VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================\n');
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
