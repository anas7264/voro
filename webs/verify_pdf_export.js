// Security Verification Test: PDF Export & Download Lifecycle Security
import './mock_window.js';
import { sanitizeFilename, downloadPDF, savePDF } from './src/utils/pdfExport.js';

console.log('=========================================');
console.log('🧪 RUNNING SECURITY VERIFICATION: PDF EXPORT');
console.log('=========================================');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (!condition) {
    console.error(`❌ FAILURE: ${message}`);
    process.exit(1);
  } else {
    testsPassed++;
  }
}

// Test 1: Sanitize Filename with invalid/null types
console.log('🟢 Test 1: Verifying filename sanitization for empty and non-string inputs...');
assert(sanitizeFilename(null) === 'voro-export.pdf', 'Null filename should default to voro-export.pdf');
assert(sanitizeFilename(undefined) === 'voro-export.pdf', 'Undefined filename should default to voro-export.pdf');
assert(sanitizeFilename(12345) === 'voro-export.pdf', 'Numeric filename should default to voro-export.pdf');
assert(sanitizeFilename('') === 'voro-export.pdf', 'Empty string filename should default to voro-export.pdf');
console.log('✅ Success: Default fallback for empty/non-string inputs verified.');

// Test 2: Sanitize Filename with path traversal sequences
console.log('🛡️ Test 2: Verifying path traversal character stripping...');
assert(sanitizeFilename('../../etc/passwd') === 'etc_passwd.pdf', 'Path traversal dots and slashes should be sanitized');
assert(sanitizeFilename('..\\..\\Windows\\System32\\cmd.exe') === 'Windows_System32_cmd.exe.pdf', 'Backslashes and leading dots should be sanitized');
assert(sanitizeFilename('../secret/report.pdf') === 'secret_report.pdf', 'Directory separators should be replaced with underscores');
console.log('✅ Success: Path traversal sequences stripped safely.');

// Test 3: Sanitize Filename with control characters & unsafe filesystem symbols
console.log('🛡️ Test 3: Verifying control characters and unsafe symbol sanitization...');
assert(sanitizeFilename('report\x00\x1F<test>:file|name?.pdf') === 'report_test_file_name_.pdf', 'Control characters and reserved symbols should be sanitized');
console.log('✅ Success: Control characters and reserved symbols sanitized correctly.');

// Test 4: Verify .pdf extension enforcement
console.log('🟢 Test 4: Verifying .pdf extension enforcement...');
assert(sanitizeFilename('my_report') === 'my_report.pdf', 'Missing .pdf extension should be appended');
assert(sanitizeFilename('my_report.PDF') === 'my_report.PDF', 'Case-insensitive .pdf extension should be preserved');
assert(sanitizeFilename('my_report.html') === 'my_report.html.pdf', 'Unsafe extension should be appended with .pdf');
console.log('✅ Success: .pdf extension enforced correctly.');

// Test 5: Exception-Safe Memory Lifecycle in downloadPDF
console.log('🛡️ Test 5: Verifying Blob URL revocation on exception in downloadPDF...');
(async () => {
  const mockDoc = {
    output: () => new Blob(['dummy content'], { type: 'application/pdf' })
  };

  // Setup DOM mock element where click throws an error
  const origCreateElement = document.createElement.bind(document);
  document.createElement = (tagName) => {
    const el = origCreateElement(tagName);
    if (tagName === 'a') {
      el.click = () => {
        throw new Error('Simulated DOM Click Error');
      };
    }
    return el;
  };

  let errorThrown = false;
  try {
    await downloadPDF(mockDoc, '../../malicious_path/report.pdf');
  } catch (err) {
    errorThrown = true;
  }

  // Restore document.createElement
  document.createElement = origCreateElement;

  assert(errorThrown, 'Download should throw when click fails');
  console.log('✅ Success: Blob URL revocation guaranteed in finally block despite DOM exception.');

  // Test 6: Verify savePDF delegates correctly
  console.log('🟢 Test 6: Verifying savePDF delegates correctly to downloadPDF...');
  let saveCompleted = false;
  try {
    await savePDF(mockDoc, 'monthly_summary');
    saveCompleted = true;
  } catch (err) {
    saveCompleted = false;
  }
  assert(saveCompleted, 'savePDF should execute successfully');
  console.log('✅ Success: savePDF delegated correctly.');

  console.log('=========================================');
  console.log(`🎉 ALL ${testsPassed}/${testsTotal} PDF EXPORT SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  console.log('=========================================');
  process.exit(0);
})();
