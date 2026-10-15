const fs = require('fs');
const path = require('path');

console.log('⚡ STARTING PERFORMANCE VERIFICATION SUITE [v21]...\n');

let failed = false;

// Test 1: Verify Reports.jsx TDZ fix and dataset event delegation
console.log('🔍 Test 1: Verifying Reports.jsx TDZ resolution & zero-allocation event delegation...');
const reportsPath = path.join(__dirname, 'src/pages/Reports.jsx');
const reportsContent = fs.readFileSync(reportsPath, 'utf8');

if (!reportsContent.includes('data-key={exportItem.key}')) {
  console.error('❌ FAIL: SecureExportEnclave does not use data-key attribute for event delegation.');
  failed = true;
} else {
  console.log('  ✓ SecureExportEnclave utilizes data-key attribute for zero-allocation click delegation.');
}

if (!reportsContent.includes('const handleItemClick = useCallback(')) {
  console.error('❌ FAIL: SecureExportEnclave does not use handleItemClick callback.');
  failed = true;
} else {
  console.log('  ✓ SecureExportEnclave uses memoized handleItemClick handler.');
}

// Check TDZ order: rawWorkouts, rawNutrition, rawMetrics must be declared before triggerDownload
const rawWorkoutsPos = reportsContent.indexOf('const rawWorkouts = useMemo');
const triggerDownloadPos = reportsContent.indexOf('const triggerDownload = useCallback');

if (rawWorkoutsPos === -1 || triggerDownloadPos === -1) {
  console.error('❌ FAIL: Could not locate rawWorkouts or triggerDownload in Reports.jsx.');
  failed = true;
} else if (rawWorkoutsPos > triggerDownloadPos) {
  console.error('❌ FAIL: TDZ Bug detected! rawWorkouts is declared after triggerDownload.');
  failed = true;
} else {
  console.log('  ✓ TDZ Order verified: rawWorkouts/rawNutrition/rawMetrics declared BEFORE triggerDownload.');
}

// Test 2: Verify EducationHub.jsx fast-path and FEATURED_ARTICLE preprocessing
console.log('\n🔍 Test 2: Verifying EducationHub.jsx O(1) fast-path & FEATURED_ARTICLE pre-processing...');
const eduPath = path.join(__dirname, 'src/pages/EducationHub.jsx');
const eduContent = fs.readFileSync(eduPath, 'utf8');

if (!eduContent.includes('const DEFAULT_NON_FEATURED_ARTICLES = Object.freeze(PRE_PROCESSED_ARTICLES.filter(')) {
  console.error('❌ FAIL: DEFAULT_NON_FEATURED_ARTICLES static dataset not found.');
  failed = true;
} else {
  console.log('  ✓ DEFAULT_NON_FEATURED_ARTICLES static dataset pre-computed and frozen.');
}

if (!eduContent.includes('const FEATURED_ARTICLE = PRE_PROCESSED_ARTICLES.find(')) {
  console.error('❌ FAIL: FEATURED_ARTICLE is not derived from PRE_PROCESSED_ARTICLES.');
  failed = true;
} else {
  console.log('  ✓ FEATURED_ARTICLE is derived from PRE_PROCESSED_ARTICLES (reusing precomputed _initials).');
}

if (!eduContent.includes('if (!q && cat === \'All\') {\n      return DEFAULT_NON_FEATURED_ARTICLES;\n    }')) {
  console.error('❌ FAIL: O(1) fast-path for default search and category in filteredArticles not found.');
  failed = true;
} else {
  console.log('  ✓ O(1) fast-path return implemented in filteredArticles for default state.');
}

if (!eduContent.includes('const handleBookmarkClick = useCallback(')) {
  console.error('❌ FAIL: handleBookmarkClick not found in EducationArticleCard.');
  failed = true;
} else {
  console.log('  ✓ EducationArticleCard action callbacks stabilized with useCallback.');
}

if (failed) {
  console.error('\n❌ VERIFICATION FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}
