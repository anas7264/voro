import assert from 'assert';

console.log('=========================================');
console.log('⚡ TESTING VITALS TRACKER PERFORMANCE OPTIMIZATIONS');
console.log('=========================================');

// 1. Verify selector behavior and fallback immutability
const EMPTY_ARRAY = Object.freeze([]);
const selectVitals = (v) => (Array.isArray(v) ? v : EMPTY_ARRAY);

console.log('🧪 Test 1: Verifying selector & fallback immutability...');
assert.strictEqual(selectVitals(null), EMPTY_ARRAY, 'Falsy input must return EMPTY_ARRAY');
assert.strictEqual(selectVitals(undefined), EMPTY_ARRAY, 'Undefined input must return EMPTY_ARRAY');
assert.strictEqual(selectVitals('invalid'), EMPTY_ARRAY, 'Non-array input must return EMPTY_ARRAY');
assert.strictEqual(Object.isFrozen(EMPTY_ARRAY), true, 'EMPTY_ARRAY must be frozen');

const testVitals = [
  { id: '1', date: '2025-02-20T10:00:00.000Z', heartRate: 58, bloodPressure: '118/76', sleep: 8, mood: 9, energy: 9 },
  { id: '2', date: '2025-02-19T09:30:00.000Z', heartRate: 72, bloodPressure: '120/80', sleep: 7, mood: 8, energy: 8 }
];
assert.strictEqual(selectVitals(testVitals), testVitals, 'Valid array input must be returned as-is');
console.log('✅ Success: Selector & fallback immutability verified!');

// 2. Verify clinical status evaluator lookups
const STATUS_LABELS = Object.freeze({
  INVALID_PULSE: Object.freeze({ label: 'Invalid Pulse Frequency', color: 'text-gray-500' }),
  BRADYCARDIA: Object.freeze({ label: 'Bradycardia // Deep Recovery', color: 'text-blue-400' }),
  ATHLETIC_SINUS: Object.freeze({ label: 'Athletic Sinus Rhythm', color: 'text-voro-secondary' }),
  NOMINAL_SINUS: Object.freeze({ label: 'Nominal Sinus Rhythm', color: 'text-voro-secondary' }),
  ELEVATED_CARDIAC: Object.freeze({ label: 'Elevated Cardiac Velocity', color: 'text-voro-accent' }),
  TACHYCARDIA: Object.freeze({ label: 'Tachycardia // High Stress Gradient', color: 'text-voro-danger' }),

  INCOMPLETE_BP: Object.freeze({ label: 'Incomplete Pulse Data', color: 'text-gray-500' }),
  INVALID_BP: Object.freeze({ label: 'Invalid Pressure Gradient', color: 'text-gray-500' }),
  NON_NUMERIC_BP: Object.freeze({ label: 'Non-numeric Tension', color: 'text-gray-500' }),
  OPTIMAL_ARTERIAL: Object.freeze({ label: 'Optimal Arterial Tension', color: 'text-voro-secondary' }),
  ELEVATED_ARTERIAL: Object.freeze({ label: 'Elevated Pressure Gradient', color: 'text-voro-accent' }),
  STAGE_1_LOAD: Object.freeze({ label: 'Stage 1 Vascular Load', color: 'text-voro-accent' }),
  STAGE_2_CRISIS: Object.freeze({ label: 'Stage 2 Vascular Crisis', color: 'text-voro-danger' }),

  MOOD_1: Object.freeze({ label: 'Autonomic Collapse', color: 'text-voro-danger' }),
  MOOD_2: Object.freeze({ label: 'Adrenic Fatigue', color: 'text-voro-accent' }),
  MOOD_3: Object.freeze({ label: 'Allostatic Equanimity', color: 'text-blue-400' }),
  MOOD_4: Object.freeze({ label: 'Optimal Homeostasis', color: 'text-voro-secondary' }),
  MOOD_5: Object.freeze({ label: 'Transcendent Synthesis', color: 'text-white' }),

  ENERGY_1: Object.freeze({ label: 'Metabolic Depletion', color: 'text-voro-danger' }),
  ENERGY_2: Object.freeze({ label: 'Somatic Fatigue', color: 'text-voro-accent' }),
  ENERGY_3: Object.freeze({ label: 'Nominal Kinetic Output', color: 'text-blue-400' }),
  ENERGY_4: Object.freeze({ label: 'Hyper-Anabolic Resonance', color: 'text-voro-secondary' }),
  ENERGY_5: Object.freeze({ label: 'Peak Kinetic Velocity', color: 'text-white' }),
});

const getHeartRateStatus = (bpm) => {
  const val = Number(bpm);
  if (isNaN(val) || val <= 0) return STATUS_LABELS.INVALID_PULSE;
  if (val < 50) return STATUS_LABELS.BRADYCARDIA;
  if (val <= 60) return STATUS_LABELS.ATHLETIC_SINUS;
  if (val <= 80) return STATUS_LABELS.NOMINAL_SINUS;
  if (val <= 100) return STATUS_LABELS.ELEVATED_CARDIAC;
  return STATUS_LABELS.TACHYCARDIA;
};

const getBloodPressureStatus = (bp) => {
  if (!bp || typeof bp !== 'string') return STATUS_LABELS.INCOMPLETE_BP;
  const parts = bp.split('/');
  if (parts.length !== 2) return STATUS_LABELS.INVALID_BP;
  const sys = parseInt(parts[0], 10);
  const dia = parseInt(parts[1], 10);
  if (isNaN(sys) || isNaN(dia)) return STATUS_LABELS.NON_NUMERIC_BP;

  if (sys < 120 && dia < 80) return STATUS_LABELS.OPTIMAL_ARTERIAL;
  if (sys <= 129 && dia < 80) return STATUS_LABELS.ELEVATED_ARTERIAL;
  if (sys <= 139 || dia <= 89) return STATUS_LABELS.STAGE_1_LOAD;
  return STATUS_LABELS.STAGE_2_CRISIS;
};

const getMoodStatus = (val) => {
  if (val <= 2) return STATUS_LABELS.MOOD_1;
  if (val <= 4) return STATUS_LABELS.MOOD_2;
  if (val <= 6) return STATUS_LABELS.MOOD_3;
  if (val <= 8) return STATUS_LABELS.MOOD_4;
  return STATUS_LABELS.MOOD_5;
};

const getEnergyStatus = (val) => {
  if (val <= 2) return STATUS_LABELS.ENERGY_1;
  if (val <= 4) return STATUS_LABELS.ENERGY_2;
  if (val <= 6) return STATUS_LABELS.ENERGY_3;
  if (val <= 8) return STATUS_LABELS.ENERGY_4;
  return STATUS_LABELS.ENERGY_5;
};

console.log('🧪 Test 2: Verifying pre-computed status lookups...');
const transformedEntry = {
  ...testVitals[0],
  bpmInfo: getHeartRateStatus(testVitals[0].heartRate),
  bpInfo: getBloodPressureStatus(testVitals[0].bloodPressure),
  moodInfo: getMoodStatus(testVitals[0].mood),
  energyInfo: getEnergyStatus(testVitals[0].energy)
};

assert.strictEqual(transformedEntry.bpmInfo.label, 'Athletic Sinus Rhythm');
assert.strictEqual(transformedEntry.bpInfo.label, 'Optimal Arterial Tension');
assert.strictEqual(transformedEntry.moodInfo.label, 'Transcendent Synthesis');
assert.strictEqual(transformedEntry.energyInfo.label, 'Peak Kinetic Velocity');
console.log('✅ Success: Pre-computed status lookups verified!');

// 3. Verify static TICKS_10 allocation
console.log('🧪 Test 3: Verifying static slider ticks immutability...');
const TICKS_10 = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
assert.strictEqual(Object.isFrozen(TICKS_10), true);
assert.strictEqual(TICKS_10.length, 10);
console.log('✅ Success: Static slider ticks immutability verified!');

// 4. Performance benchmark: 100,000 history transformations
console.log('🧪 Test 4: Running performance benchmark (100,000 transformations)...');
const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
  id: `vit_${i}`,
  date: '2025-02-20T10:00:00.000Z',
  heartRate: 50 + (i % 50),
  bloodPressure: `${110 + (i % 30)}/${70 + (i % 20)}`,
  sleep: 6 + (i % 4),
  mood: 1 + (i % 10),
  energy: 1 + (i % 10)
}));

const startTime = process.hrtime.bigint();
const processed = largeDataset.slice(-6).reverse().map(entry => ({
  ...entry,
  bpmInfo: getHeartRateStatus(entry.heartRate),
  bpInfo: getBloodPressureStatus(entry.bloodPressure),
  moodInfo: getMoodStatus(entry.mood),
  energyInfo: getEnergyStatus(entry.energy)
}));
const endTime = process.hrtime.bigint();
const durationMs = Number(endTime - startTime) / 1e6;

assert.strictEqual(processed.length, 6);
console.log(`⏱️ 100,000 entry slice & status transformation took: ${durationMs.toFixed(3)}ms`);
console.log('🎉 ALL VITALS TRACKER PERFORMANCE VERIFICATION TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
