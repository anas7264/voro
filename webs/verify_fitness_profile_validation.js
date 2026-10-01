import { validateFitnessProfile } from './src/utils/validators.js';

console.log('=========================================');
console.log('🧪 RUNNING VERIFICATION: FITNESS PROFILE HARDENING');
console.log('=========================================');

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ Passed: ${message}`);
    passedCount++;
  } else {
    console.error(`❌ Failed: ${message}`);
    failedCount++;
  }
}

// 🟢 Test 1: Valid minimal profile
const validMinimal = {
  name: 'Alex Vance',
  age: 28,
  height: 180,
  weight: 75,
  gender: 'Male',
  goal: 'weight_loss',
  activityLevel: 'moderately_active'
};
const res1 = validateFitnessProfile(validMinimal);
assert(res1.valid === true, 'Valid minimal profile accepted');

// 🟢 Test 2: Property fallback mapping (heightCm, currentWeight, primaryGoal)
const validFallback = {
  name: 'Elena Rostova',
  age: 32,
  heightCm: 168,
  currentWeight: 62,
  gender: 'Female',
  primaryGoal: 'muscle_gain',
  activityLevel: 'very_active'
};
const res2 = validateFitnessProfile(validFallback);
assert(res2.valid === true, 'Profile using fallback field names (heightCm, currentWeight, primaryGoal) accepted');

// 🟢 Test 3: Valid complete profile with safe optional fields
const validComplete = {
  ...validMinimal,
  targetWeight: 70,
  calorieGoal: 2200,
  bodyFat: 15,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  notes: 'Preparing for marathon training.'
};
const res3 = validateFitnessProfile(validComplete);
assert(res3.valid === true, 'Complete profile with safe optional fields accepted');

// 🛡️ Test 4: Rejection of invalid non-object profile inputs
const res4a = validateFitnessProfile(null);
assert(res4a.valid === false && res4a.errors.profile !== undefined, 'Null profile rejected');

const res4b = validateFitnessProfile('invalid string');
assert(res4b.valid === false && res4b.errors.profile !== undefined, 'String profile input rejected');

// 🛡️ Test 5: Rejection of non-finite/out-of-bounds targetWeight
const res5 = validateFitnessProfile({
  ...validMinimal,
  targetWeight: Infinity
});
assert(res5.valid === false && res5.errors.targetWeight !== undefined, 'Non-finite targetWeight rejected');

// 🛡️ Test 6: Rejection of invalid calorieGoal
const res6 = validateFitnessProfile({
  ...validMinimal,
  calorieGoal: 50 // below min threshold of 500
});
assert(res6.valid === false && res6.errors.calorieGoal !== undefined, 'Out-of-bounds calorieGoal rejected');

// 🛡️ Test 7: Rejection of SSRF / internal IP / scheme injection avatarUrl
const res7a = validateFitnessProfile({
  ...validMinimal,
  avatarUrl: 'javascript:alert(1)'
});
assert(res7a.valid === false && res7a.errors.avatarUrl !== undefined, 'javascript: URI scheme in avatarUrl rejected');

const res7b = validateFitnessProfile({
  ...validMinimal,
  avatarUrl: 'http://169.254.169.254/latest/meta-data/'
});
assert(res7b.valid === false && res7b.errors.avatarUrl !== undefined, 'Internal cloud metadata SSRF avatarUrl rejected');

// 🛡️ Test 8: Rejection of oversized notes string (client DoS/memory bloat protection)
const res8 = validateFitnessProfile({
  ...validMinimal,
  notes: 'A'.repeat(2050)
});
assert(res8.valid === false && res8.errors.notes !== undefined, 'Oversized notes string (>2048 chars) rejected');

console.log('=========================================');
console.log(`📊 RESULTS: ${passedCount} Passed, ${failedCount} Failed`);
console.log('=========================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL FITNESS PROFILE HARDENING VERIFICATION TESTS PASSED SUCCESSFULLY!');
}
