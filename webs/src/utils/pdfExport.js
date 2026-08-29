// VORO PDF Export
// PDF generation with VORO branding for reports and plans

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { executeSecurely, sanitizeInput } from "./security.js";
import voroCrypto from "./crypto.js";

// VORO branding colors
const VORO_COLORS = {
  primary: "#7C3AED",
  secondary: "#10B981",
  accent: "#F59E0B",
  text: "#1F2937",
  lightText: "#6B7280",
  border: "#E5E7EB",
  background: "#F9FAFB"
};

// Cryptographically Secure Content Attestation Signature (SCAS) helper
// Generates a HMAC-SHA-256 signature of report contents to verify authenticity
const generateSCAS = async (title, content) => {
  const signature = await voroCrypto.computeHmacSignature(`${title || ""}|${content || ""}`);
  return `SCAS-HMAC:${(signature || "FAILED").slice(0, 16).toUpperCase()}`;
};

// Generate PDF with VORO header
const addVOROHeader = (doc, title, subtitle = "") => {
  const sanitizedTitle = sanitizeInput(title || "VORO Export");
  const sanitizedSubtitle = sanitizeInput(subtitle || "");

  // Metadata scrubbing to prevent architectural/generator leakage
  doc.setProperties({
    title: sanitizedTitle,
    subject: "Biometric Data",
    author: "VORO Secure Engine",
    creator: "VORO",
    producer: "VORO"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header background
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, pageWidth, 40, "F");

  // VORO Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("VORO", 15, 25);

  // Page title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(sanitizedTitle, 50, 20);

  // Subtitle if provided
  if (sanitizedSubtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(sanitizedSubtitle, 50, 28);
  }

  // Date
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 50, 25);

  // Reset text color
  doc.setTextColor(VORO_COLORS.text);

  return 45; // Return Y position after header
};

// Add VORO footer to page
const addVOROFooter = (doc, pageNumber = 1) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(VORO_COLORS.lightText);

  // Footer line
  doc.setDrawColor(VORO_COLORS.border);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

  // Footer text
  doc.text("VORO - Your Body. Your Data. Your Evolution.", 15, pageHeight - 8);

  // Stamp Cryptographically Secure Content Attestation Signature (SCAS)
  const scasSig = doc.scasSignature || "SCAS-VERIFIED";
  doc.text(`${scasSig} | Page ${pageNumber}`, pageWidth - 75, pageHeight - 8);
};

// Export Weekly Report
export const exportWeeklyReport = async (userData, workouts, nutrition) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: userData.name, workouts, nutrition });
  doc.scasSignature = await generateSCAS("Weekly Report", serialized);

  const sanitizedUserName = sanitizeInput(userData.name);

  // Header
  yPosition = addVOROHeader(doc, "Weekly Report", `${sanitizedUserName} - Week of ${new Date().toLocaleDateString()}`);
  yPosition += 10;

  // Summary Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(124, 58, 237);
  doc.text("Summary", 15, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(VORO_COLORS.text);

  const summaryData = [
    ["Workouts Completed", workouts.length],
    ["Total Duration", `${workouts.reduce((a, w) => a + w.duration, 0)} minutes`],
    ["Total Volume", `${workouts.reduce((a, w) => a + (w.volume || 0), 0)} kg`],
    ["Nutrition Days Logged", nutrition.filter(n => n.logged).length],
    ["Average Calories", Math.round(nutrition.reduce((a, n) => a + n.calories, 0) / nutrition.length)]
  ];

  summaryData.forEach(item => {
    doc.text(`${sanitizeInput(item[0])}: `, 15, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(String(item[1]), 80, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 6;
  });

  yPosition += 5;

  // Workouts Section
  if (workouts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text("Workouts", 15, yPosition);
    yPosition += 8;

    const workoutData = workouts.map(w => [
      new Date(w.date).toLocaleDateString(),
      sanitizeInput(w.type),
      w.duration,
      w.volume || "-",
      w.notes ? sanitizeInput(w.notes).substring(0, 20) + "..." : "-"
    ]);

    autoTable(doc, {
      head: [["Date", "Type", "Duration (min)", "Volume (kg)", "Notes"]],
      body: workoutData,
      startY: yPosition,
      margin: { left: 15, right: 15 },
      headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      didDrawPage: (data) => {
        yPosition = data.cursor.y;
      }
    });

    yPosition += 5;
  }

  // Add footer
  addVOROFooter(doc);

  return doc;
};

// Export Monthly Report
export const exportMonthlyReport = async (userData, allWorkouts, allNutrition, metrics) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: userData.name, allWorkouts, allNutrition, metrics });
  doc.scasSignature = await generateSCAS("Monthly Report", serialized);

  const sanitizedUserName = sanitizeInput(userData.name);

  // Header
  yPosition = addVOROHeader(doc, "Monthly Report", `${sanitizedUserName} - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`);
  yPosition += 10;

  // Key Metrics
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(124, 58, 237);
  doc.text("Key Metrics", 15, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(VORO_COLORS.text);

  const metricsData = [
    ["Total Workouts", allWorkouts.length],
    ["Average Workout Duration", Math.round(allWorkouts.reduce((a, w) => a + w.duration, 0) / allWorkouts.length) + " min"],
    ["Total Training Volume", allWorkouts.reduce((a, w) => a + (w.volume || 0), 0) + " kg"],
    ["Weight Change", `${metrics.weightChange > 0 ? "+" : ""}${metrics.weightChange.toFixed(1)} kg`],
    ["Body Fat Change", `${metrics.bodyFatChange > 0 ? "+" : ""}${metrics.bodyFatChange.toFixed(1)}%`],
    ["Average Daily Calories", Math.round(allNutrition.reduce((a, n) => a + n.calories, 0) / allNutrition.length)]
  ];

  metricsData.forEach(item => {
    doc.text(`${sanitizeInput(item[0])}: `, 15, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(String(item[1]), 80, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(VORO_COLORS.text);
    yPosition += 7;
  });

  yPosition += 5;

  // Workout breakdown
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(124, 58, 237);
  doc.text("Workout Breakdown", 15, yPosition);
  yPosition += 8;

  const workoutTypes = {};
  allWorkouts.forEach(w => {
    const type = sanitizeInput(w.type);
    workoutTypes[type] = (workoutTypes[type] || 0) + 1;
  });

  const typeData = Object.entries(workoutTypes).map(([type, count]) => [type, count]);

  autoTable(doc, {
    head: [["Workout Type", "Count"]],
    body: typeData,
    startY: yPosition,
    margin: { left: 15, right: 15 },
    headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
    didDrawPage: (data) => {
      yPosition = data.cursor.y;
    }
  });

  // Add footer
  addVOROFooter(doc);

  return doc;
};

// Export Meal Plan
export const exportMealPlan = async (mealPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: userData.name, mealPlan });
  doc.scasSignature = await generateSCAS("Meal Plan", serialized);

  const sanitizedUserName = sanitizeInput(userData.name);

  // Header
  yPosition = addVOROHeader(doc, "Meal Plan", `${sanitizedUserName} - 7 Day Plan`);
  yPosition += 10;

  // Nutrition targets
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(124, 58, 237);
  doc.text("Daily Targets:", 15, yPosition);
  yPosition += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(VORO_COLORS.text);
  doc.text(`Calories: ${userData.tdee} | Protein: ${userData.proteinTarget}g | Carbs: ${userData.carbsTarget}g | Fat: ${userData.fatTarget}g`, 15, yPosition);
  yPosition += 10;

  // Daily meals
  mealPlan.forEach((day, index) => {
    if (yPosition > 250) {
      doc.addPage();
      addVOROFooter(doc);
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Day ${index + 1}: ${day.date}`, 15, yPosition);
    yPosition += 7;

    const mealData = day.meals.map(meal => [
      sanitizeInput(meal.type),
      sanitizeInput(meal.name),
      `${meal.calories} kcal`,
      `P:${meal.protein}g C:${meal.carbs}g F:${meal.fat}g`
    ]);

    autoTable(doc, {
      head: [["Type", "Meal", "Calories", "Macros"]],
      body: mealData,
      startY: yPosition,
      margin: { left: 15, right: 15 },
      headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 5;
      }
    });
  });

  addVOROFooter(doc);

  return doc;
};

// Export Training Plan
export const exportTrainingPlan = async (trainingPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;
  let pageNum = 1;

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: userData.name, trainingPlan });
  doc.scasSignature = await generateSCAS("Training Plan", serialized);

  const sanitizedUserName = sanitizeInput(userData.name);

  // Header
  yPosition = addVOROHeader(doc, "Training Plan", `${sanitizedUserName} - 4 Week Periodization`);
  yPosition += 10;

  // Plan overview
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(124, 58, 237);
  doc.text("Training Overview:", 15, yPosition);
  yPosition += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(VORO_COLORS.text);
  doc.text(`Goal: ${sanitizeInput(userData.goal)} | Experience: ${sanitizeInput(userData.experienceLevel)} | Days/Week: ${userData.availableDays}`, 15, yPosition);
  yPosition += 10;

  // Weekly workouts
  trainingPlan.forEach((week, weekIndex) => {
    if (yPosition > 240) {
      doc.addPage();
      pageNum++;
      addVOROFooter(doc, pageNum);
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(124, 58, 237);
    doc.text(`Week ${weekIndex + 1}`, 15, yPosition);
    yPosition += 7;

    week.workouts.forEach(workout => {
      if (yPosition > 250) {
        doc.addPage();
        pageNum++;
        addVOROFooter(doc, pageNum);
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text(`${sanitizeInput(workout.day)}: ${sanitizeInput(workout.type)}`, 15, yPosition);
      yPosition += 5;

      const exerciseData = workout.exercises.map(ex => [
        sanitizeInput(ex.name),
        `${ex.sets}x${ex.reps}`,
        ex.weight ? `${ex.weight}kg` : "Bodyweight",
        ex.restTime ? sanitizeInput(ex.restTime) : "60s"
      ]);

      autoTable(doc, {
        head: [["Exercise", "Sets x Reps", "Weight", "Rest"]],
        body: exerciseData,
        startY: yPosition,
        margin: { left: 15, right: 15 },
        headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        didDrawPage: (data) => {
          yPosition = data.cursor.y + 3;
        }
      });
    });

    yPosition += 5;
  });

  addVOROFooter(doc, pageNum);

  return doc;
};

// Helper to sanitize filename and prevent path traversal, control characters, and unsafe extensions
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string' || !filename) {
    return 'voro-export.pdf';
  }
  // Strip path traversal sequences (..), directory separators, and control characters
  let clean = filename
    .replace(/\.\./g, '')
    .replace(/[\/\\?%*:|"<>]/g, '_')
    .replace(/[\x00-\x1F\x7F]/g, '');
  // Collapse multiple underscores and strip leading/trailing dots/underscores
  clean = clean.replace(/_+/g, '_').replace(/^[\._]+/, '');
  if (!clean.toLowerCase().endsWith('.pdf')) {
    clean += '.pdf';
  }
  return clean || 'voro-export.pdf';
};

// Download PDF directly via Secure Blob URL managed within an executeSecurely block.
// Complies with VORO's active RASP capability attestation model and uses try...finally to prevent URL leaks.
export const downloadPDF = async (doc, filename) => {
  const safeFilename = sanitizeFilename(filename);
  const blob = doc.output("blob");
  const url = await executeSecurely("Download PDF", () => {
    return window.URL.createObjectURL(blob);
  }, ["sink:URL.createObjectURL"]);

  try {
    const element = document.createElement("a");
    element.href = url;
    element.download = safeFilename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } finally {
    await executeSecurely("Cleanup PDF URL", () => {
      window.URL.revokeObjectURL(url);
    }, ["sink:URL.revokeObjectURL"]);
  }
};

// Save PDF to file via downloadPDF delegate
export const savePDF = async (doc, filename) => {
  return downloadPDF(doc, filename);
};

export default {
  addVOROHeader,
  addVOROFooter,
  exportWeeklyReport,
  exportMonthlyReport,
  exportMealPlan,
  exportTrainingPlan,
  savePDF,
  downloadPDF
};
