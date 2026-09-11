import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=========================================");
console.log("⚡ VERIFYING LUXURY CHART REFINEMENTS");
console.log("=========================================");

const lineChartPath = path.join(__dirname, 'src', 'components', 'LineChartComponent.jsx');
const areaChartPath = path.join(__dirname, 'src', 'components', 'AreaChartComponent.jsx');

const lineChartCode = fs.readFileSync(lineChartPath, 'utf8');
const areaChartCode = fs.readFileSync(areaChartPath, 'utf8');

// Test 1: LineChartComponent checks
console.log("🧪 Test 1: Verifying LineChartComponent luxury refinements...");
if (!lineChartCode.includes('0xCHT_TELEMETRY')) {
  throw new Error("LineChartComponent missing sub-pixel attestation hash badge '0xCHT_TELEMETRY'");
}
if (!lineChartCode.includes('DEFAULT_MARGIN = Object.freeze')) {
  throw new Error("LineChartComponent missing hoisted frozen DEFAULT_MARGIN fallback");
}
if (!lineChartCode.includes('font-serif italic')) {
  throw new Error("LineChartComponent missing Playfair Display italic serif typography in CustomTooltip");
}
console.log("✅ LineChartComponent verified!");

// Test 2: AreaChartComponent checks
console.log("🧪 Test 2: Verifying AreaChartComponent luxury refinements...");
if (!areaChartCode.includes('0xAREA_TELEMETRY')) {
  throw new Error("AreaChartComponent missing sub-pixel attestation hash badge '0xAREA_TELEMETRY'");
}
if (!areaChartCode.includes('DEFAULT_MARGIN = Object.freeze')) {
  throw new Error("AreaChartComponent missing hoisted frozen DEFAULT_MARGIN fallback");
}
if (!areaChartCode.includes('font-serif italic')) {
  throw new Error("AreaChartComponent missing Playfair Display italic serif typography in CustomTooltip");
}
console.log("✅ AreaChartComponent verified!");

console.log("=========================================");
console.log("🎉 ALL LUXURY CHART VERIFICATIONS PASSED!");
console.log("=========================================");
