const assert = require('assert');

async function testDailyOptimization() {
  console.log('⚡ Starting VORO Daily Optimization Verification Suite...');

  // 1. Verify webs/src/utils/training.js
  const training = await import('./src/utils/training.js');

  // Test detectPersonalRecords
  const pr1 = training.detectPersonalRecords({ exercise: 'Bench Press', weight: 100 }, { 'Bench Press': 90 });
  assert.strictEqual(pr1.isNewPR, true);
  assert.strictEqual(pr1.improvement, 10);
  assert.strictEqual(pr1.improvementPercentage, '11.1');

  // Edge case: 0 prevMax and 0 currWeight
  const prEdge = training.detectPersonalRecords({ exercise: 'Squat', weight: 0 }, { 'Squat': 0 });
  assert.strictEqual(prEdge.isNewPR, false);
  assert.strictEqual(prEdge.improvementPercentage, '0.0');
  console.log('  ✓ detectPersonalRecords boundary safety verified.');

  // Test calculateRelativeIntensity with non-finite / zero inputs
  const riZero = training.calculateRelativeIntensity(0, 0, 10);
  assert.strictEqual(riZero.percentageOfMax, '0.0');
  assert.strictEqual(riZero.estimatedRPE, 0);

  const riNormal = training.calculateRelativeIntensity(100, 100, 5);
  assert.strictEqual(riNormal.percentageOfMax, '100.0');
  assert.strictEqual(riNormal.estimatedRPE, 9.5);
  console.log('  ✓ calculateRelativeIntensity boundary safety verified.');

  // Test calculateTrainingStress
  const stressZero = training.calculateTrainingStress(0, 0, 0, 0);
  assert.strictEqual(stressZero.percentageOfMax, '0.0');
  assert.strictEqual(stressZero.stressScore, 0);

  const stressNormal = training.calculateTrainingStress(3, 10, 80, 100);
  assert.strictEqual(stressNormal.percentageOfMax, '80.0');
  assert.strictEqual(stressNormal.totalReps, 30);
  assert.strictEqual(stressNormal.volumeLoad, 2400);
  console.log('  ✓ calculateTrainingStress boundary safety verified.');

  // Test analyzeTrainingVolume with dirty/missing items
  const volResult = training.analyzeTrainingVolume([
    { exercise: 'Bench Press', sets: 3, reps: 10, weight: 100, date: '2025-05-15' },
    null,
    { exercise: 'Squat', volume: NaN, sets: 4, reps: 8, weight: 120, date: new Date('2025-05-15') }
  ]);
  assert.strictEqual(volResult.totalVolume > 0, true);
  assert.strictEqual(Number.isFinite(volResult.totalVolume), true);
  console.log('  ✓ analyzeTrainingVolume dirty dataset resilience verified.');

  // 2. Verify webs/src/utils/nutrition.js
  const nutrition = await import('./src/utils/nutrition.js');

  // Test calculateNutritionScore
  assert.strictEqual(nutrition.calculateNutritionScore(0, 0, 0, 0), 0);
  assert.strictEqual(nutrition.calculateNutritionScore(NaN, null, undefined, -100), 0);
  const scoreNormal = nutrition.calculateNutritionScore(30, 50, 20, 2000);
  assert.strictEqual(Number.isFinite(scoreNormal) && scoreNormal > 0, true);
  console.log('  ✓ calculateNutritionScore boundary safety verified.');

  // Test analyzeMacros
  const macros = nutrition.analyzeMacros(150, 200, 60, 150, 200, 60);
  assert.strictEqual(macros.protein.status, 'On Target');
  assert.strictEqual(macros.protein.percentOfTarget, '100.0');

  const macrosZero = nutrition.analyzeMacros(NaN, null, -10, 0, 0, 0);
  assert.strictEqual(macrosZero.protein.percentOfTarget, '0.0');
  console.log('  ✓ analyzeMacros boundary safety verified.');

  // Test calculateGlycemicLoad
  const glResult = nutrition.calculateGlycemicLoad([
    { carbs: 50, glycemicIndex: 60 },
    null,
    { carbs: NaN, glycemicIndex: undefined }
  ]);
  assert.strictEqual(glResult.glycemicLoad, 30);
  assert.strictEqual(glResult.classification, 'High');
  console.log('  ✓ calculateGlycemicLoad boundary safety verified.');

  // Test calculateDailyWaterNeeds
  assert.strictEqual(nutrition.calculateDailyWaterNeeds(0).litersPerDay, 0);
  assert.strictEqual(nutrition.calculateDailyWaterNeeds(NaN).litersPerDay, 0);
  const waterNorm = nutrition.calculateDailyWaterNeeds(80, 'intense');
  assert.strictEqual(waterNorm.litersPerDay > 0, true);
  console.log('  ✓ calculateDailyWaterNeeds boundary safety verified.');

  // 3. Verify webs/src/utils/storage.js
  const { default: storage } = await import('./src/utils/storage.js');

  // Test fast path array query on get
  storage.cache.set('user', { name: 'VORO Subject' });
  storage.cache.set('profile', { id: '0x123' });

  const multiGet = storage.get(['user', 'profile']);
  assert.strictEqual(multiGet.user.name, 'VORO Subject');
  assert.strictEqual(multiGet.profile.id, '0x123');
  console.log('  ✓ StorageManager.get array query fast-path verified.');

  console.log('🎉 ALL VORO Daily Optimization Tests Passed Successfully!');
}

testDailyOptimization().catch(err => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
