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
const barChartPath = path.join(__dirname, 'src', 'components', 'BarChartComponent.jsx');
const pieChartPath = path.join(__dirname, 'src', 'components', 'PieChartComponent.jsx');
const radarChartPath = path.join(__dirname, 'src', 'components', 'RadarChartComponent.jsx');

const lineChartCode = fs.readFileSync(lineChartPath, 'utf8');
const areaChartCode = fs.readFileSync(areaChartPath, 'utf8');
const barChartCode = fs.readFileSync(barChartPath, 'utf8');
const pieChartCode = fs.readFileSync(pieChartPath, 'utf8');
const radarChartCode = fs.readFileSync(radarChartPath, 'utf8');

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

// Test 3: BarChartComponent checks
console.log("🧪 Test 3: Verifying BarChartComponent luxury refinements...");
if (!barChartCode.includes('0xBAR_TELEMETRY')) {
  throw new Error("BarChartComponent missing sub-pixel attestation hash badge '0xBAR_TELEMETRY'");
}
if (!barChartCode.includes('DEFAULT_MARGIN = Object.freeze')) {
  throw new Error("BarChartComponent missing hoisted frozen DEFAULT_MARGIN fallback");
}
if (!barChartCode.includes('font-serif italic')) {
  throw new Error("BarChartComponent missing Playfair Display italic serif typography in CustomTooltip");
}
console.log("✅ BarChartComponent verified!");

// Test 4: PieChartComponent checks
console.log("🧪 Test 4: Verifying PieChartComponent luxury refinements...");
if (!pieChartCode.includes('0xPIE_TELEMETRY')) {
  throw new Error("PieChartComponent missing sub-pixel attestation hash badge '0xPIE_TELEMETRY'");
}
if (!pieChartCode.includes('DEFAULT_COLORS = Object.freeze')) {
  throw new Error("PieChartComponent missing hoisted frozen DEFAULT_COLORS fallback");
}
if (!pieChartCode.includes('font-serif italic')) {
  throw new Error("PieChartComponent missing Playfair Display italic serif typography in CustomTooltip");
}
console.log("✅ PieChartComponent verified!");

// Test 5: RadarChartComponent checks
console.log("🧪 Test 5: Verifying RadarChartComponent luxury refinements...");
if (!radarChartCode.includes('0xRADAR_TELEMETRY')) {
  throw new Error("RadarChartComponent missing sub-pixel attestation hash badge '0xRADAR_TELEMETRY'");
}
if (!radarChartCode.includes('DEFAULT_MARGIN = Object.freeze')) {
  throw new Error("RadarChartComponent missing hoisted frozen DEFAULT_MARGIN fallback");
}
if (!radarChartCode.includes('font-serif italic')) {
  throw new Error("RadarChartComponent missing Playfair Display italic serif typography in CustomTooltip");
}
console.log("✅ RadarChartComponent verified!");

console.log("=========================================");
console.log("🎉 ALL LUXURY CHART VERIFICATIONS PASSED!");
console.log("=========================================");
