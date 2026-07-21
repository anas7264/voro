/**
 * Dedicated security verification script for ASE-CAL (Active Session Ephemerality & Cryptographic Auto-Lock).
 * This runs in Node.js and simulates complete idle-shred and active re-attestation cycles to verify the Zero-Trust memory defense.
 */

// Import mock window first to ensure it is evaluated before crypto and storage
import { triggerDocStart } from './mock_window.js';

// Now static imports
import cryptoManager from './src/utils/crypto.js';
import storage from './src/utils/storage.js';

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING SECURITY VERIFICATION: ASE-CAL");
  console.log("=========================================");

  // Manually mock values for keys/cache to simulate active state
  cryptoManager.key = "mock_master_key";
  cryptoManager.hkdfKey = "mock_hkdf_key";
  cryptoManager.domainKeyCache.set("test_domain", "mock_derived_key");
  cryptoManager.initialized = true;

  storage.cache.set("user", { name: "Elite User" });

  console.log("🟢 Initial state checks (Active)...");
  if (cryptoManager.key && cryptoManager.initialized && storage.cache.has("user")) {
    console.log("✅ Initial active keys & cache verified successfully.");
  } else {
    throw new Error("❌ Initial active state setup failed!");
  }

  // --- TEST 1: Idle Timeout event shreds memory ---
  console.log("\n🛡️ Test 1: Simulating idle timeout and dispatching 'voro-security-idle-shred'...");

  const idleEvent = new CustomEvent('voro-security-idle-shred', { detail: { timestamp: Date.now() } });
  window.dispatchEvent(idleEvent);

  // Check if shredded
  if (!cryptoManager.key && !cryptoManager.hkdfKey && cryptoManager.domainKeyCache.size === 0 && !cryptoManager.initialized) {
    console.log("✅ Success: Cryptographic keys shredded from memory successfully.");
  } else {
    throw new Error(`❌ Failure: Cryptographic keys were not shredded! key=${cryptoManager.key}`);
  }

  if (storage.cache.size === 0) {
    console.log("✅ Success: Decrypted storage cache cleared successfully.");
  } else {
    throw new Error("❌ Failure: Storage cache was not cleared!");
  }

  // --- TEST 2: Active Re-Attestation ---
  console.log("\n🏃 Test 2: Simulating trusted user interaction to trigger session re-activation...");

  // Set flag manually as if the pulse set it
  window._voro_idle_shredded = true;

  let userActiveTriggered = false;
  window.addEventListener('voro-security-user-active', () => {
    userActiveTriggered = true;
  });

  // Trigger trusted interaction
  triggerDocStart('mousedown', { type: 'mousedown', button: 0, isTrusted: true });

  if (!window._voro_idle_shredded && userActiveTriggered) {
    console.log("✅ Success: User presence re-attested, sending 'voro-security-user-active' event and resetting idle state.");
  } else {
    throw new Error(`❌ Failure: User re-attestation did not execute correctly! shredded=${window._voro_idle_shredded}, event=${userActiveTriggered}`);
  }

  console.log("\n🎉 ALL ASE-CAL SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
