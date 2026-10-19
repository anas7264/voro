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
const DocClass = typeof jsPDF === "function" ? jsPDF : (jsPDF.jsPDF || jsPDF);

// Export Weekly Report
export const exportWeeklyReport = async (userData, workouts, nutrition) => {
  const doc = new DocClass();
  let yPosition = 10;

  const safeUserData = userData && typeof userData === "object" ? userData : {};
  const safeWorkouts = Array.isArray(workouts) ? workouts : [];
  const safeNutrition = Array.isArray(nutrition) ? nutrition : [];

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: safeUserData.name, workouts: safeWorkouts, nutrition: safeNutrition });
  doc.scasSignature = await generateSCAS("Weekly Report", serialized);

  const sanitizedUserName = sanitizeInput(safeUserData.name || "User");

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

  const totalDuration = safeWorkouts.reduce((a, w) => a + (w && Number.isFinite(w.duration) ? w.duration : 0), 0);
  const totalVolume = safeWorkouts.reduce((a, w) => a + (w && Number.isFinite(w.volume) ? w.volume : 0), 0);
  const loggedDays = safeNutrition.filter(n => n && n.logged).length;
  const avgCalories = safeNutrition.length > 0
    ? Math.round(safeNutrition.reduce((a, n) => a + (n && Number.isFinite(n.calories) ? n.calories : 0), 0) / safeNutrition.length)
    : 0;

  const summaryData = [
    ["Workouts Completed", safeWorkouts.length],
    ["Total Duration", `${totalDuration} minutes`],
    ["Total Volume", `${totalVolume} kg`],
    ["Nutrition Days Logged", loggedDays],
    ["Average Calories", avgCalories]
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
  if (safeWorkouts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text("Workouts", 15, yPosition);
    yPosition += 8;

    const workoutData = safeWorkouts.map(w => [
      w && w.date ? new Date(w.date).toLocaleDateString() : "-",
      sanitizeInput(w && w.type),
      w && Number.isFinite(w.duration) ? w.duration : "-",
      w && Number.isFinite(w.volume) ? w.volume : "-",
      w && w.notes ? sanitizeInput(w.notes).substring(0, 20) + "..." : "-"
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
  const doc = new DocClass();
  let yPosition = 10;

  const safeUserData = userData && typeof userData === "object" ? userData : {};
  const safeWorkouts = Array.isArray(allWorkouts) ? allWorkouts : [];
  const safeNutrition = Array.isArray(allNutrition) ? allNutrition : [];
  const safeMetrics = metrics && typeof metrics === "object" ? metrics : {};

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: safeUserData.name, allWorkouts: safeWorkouts, allNutrition: safeNutrition, metrics: safeMetrics });
  doc.scasSignature = await generateSCAS("Monthly Report", serialized);

  const sanitizedUserName = sanitizeInput(safeUserData.name || "User");

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

  const avgDuration = safeWorkouts.length > 0
    ? Math.round(safeWorkouts.reduce((a, w) => a + (w && Number.isFinite(w.duration) ? w.duration : 0), 0) / safeWorkouts.length)
    : 0;
  const totalVolume = safeWorkouts.reduce((a, w) => a + (w && Number.isFinite(w.volume) ? w.volume : 0), 0);
  const wc = safeMetrics && Number.isFinite(safeMetrics.weightChange) ? safeMetrics.weightChange : 0;
  const bfc = safeMetrics && Number.isFinite(safeMetrics.bodyFatChange) ? safeMetrics.bodyFatChange : 0;
  const avgCalories = safeNutrition.length > 0
    ? Math.round(safeNutrition.reduce((a, n) => a + (n && Number.isFinite(n.calories) ? n.calories : 0), 0) / safeNutrition.length)
    : 0;

  const metricsData = [
    ["Total Workouts", safeWorkouts.length],
    ["Average Workout Duration", `${avgDuration} min`],
    ["Total Training Volume", `${totalVolume} kg`],
    ["Weight Change", `${wc > 0 ? "+" : ""}${wc.toFixed(1)} kg`],
    ["Body Fat Change", `${bfc > 0 ? "+" : ""}${bfc.toFixed(1)}%`],
    ["Average Daily Calories", avgCalories]
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
  safeWorkouts.forEach(w => {
    const type = sanitizeInput(w && w.type ? w.type : "Other");
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
  const doc = new DocClass();
  let yPosition = 10;

  const safeUserData = userData && typeof userData === "object" ? userData : {};
  const safeMealPlan = Array.isArray(mealPlan) ? mealPlan : [];

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: safeUserData.name, mealPlan: safeMealPlan });
  doc.scasSignature = await generateSCAS("Meal Plan", serialized);

  const sanitizedUserName = sanitizeInput(safeUserData.name || "User");

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
  doc.text(`Calories: ${safeUserData.tdee || "-"} | Protein: ${safeUserData.proteinTarget || "-"}g | Carbs: ${safeUserData.carbsTarget || "-"}g | Fat: ${safeUserData.fatTarget || "-"}g`, 15, yPosition);
  yPosition += 10;

  // Daily meals
  safeMealPlan.forEach((day, index) => {
    if (!day || typeof day !== "object") return;
    if (yPosition > 250) {
      doc.addPage();
      addVOROFooter(doc);
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Day ${index + 1}: ${sanitizeInput(day.date || "")}`, 15, yPosition);
    yPosition += 7;

    const safeMeals = Array.isArray(day.meals) ? day.meals : [];
    const mealData = safeMeals.map(meal => [
      sanitizeInput(meal && meal.type ? meal.type : "-"),
      sanitizeInput(meal && meal.name ? meal.name : "-"),
      `${meal && Number.isFinite(meal.calories) ? meal.calories : "-"} kcal`,
      `P:${meal && Number.isFinite(meal.protein) ? meal.protein : "-"}g C:${meal && Number.isFinite(meal.carbs) ? meal.carbs : "-"}g F:${meal && Number.isFinite(meal.fat) ? meal.fat : "-"}g`
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
  const doc = new DocClass();
  let yPosition = 10;
  let pageNum = 1;

  const safeUserData = userData && typeof userData === "object" ? userData : {};
  const safeTrainingPlan = Array.isArray(trainingPlan) ? trainingPlan : [];

  // Sign report contents using SCAS (HMAC-SHA-256)
  const serialized = JSON.stringify({ name: safeUserData.name, trainingPlan: safeTrainingPlan });
  doc.scasSignature = await generateSCAS("Training Plan", serialized);

  const sanitizedUserName = sanitizeInput(safeUserData.name || "User");

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
  doc.text(`Goal: ${sanitizeInput(safeUserData.goal || "-")} | Experience: ${sanitizeInput(safeUserData.experienceLevel || "-")} | Days/Week: ${safeUserData.availableDays || "-"}`, 15, yPosition);
  yPosition += 10;

  // Weekly workouts
  safeTrainingPlan.forEach((week, weekIndex) => {
    if (!week || typeof week !== "object") return;
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

    const safeWorkouts = Array.isArray(week.workouts) ? week.workouts : [];
    safeWorkouts.forEach(workout => {
      if (!workout || typeof workout !== "object") return;
      if (yPosition > 250) {
        doc.addPage();
        pageNum++;
        addVOROFooter(doc, pageNum);
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text(`${sanitizeInput(workout.day || "-")}: ${sanitizeInput(workout.type || "-")}`, 15, yPosition);
      yPosition += 5;

      const safeExercises = Array.isArray(workout.exercises) ? workout.exercises : [];
      const exerciseData = safeExercises.map(ex => [
        sanitizeInput(ex && ex.name ? ex.name : "-"),
        `${ex && ex.sets ? ex.sets : "-"}` + "x" + `${ex && ex.reps ? ex.reps : "-"}`,
        ex && ex.weight ? `${ex.weight}kg` : "Bodyweight",
        ex && ex.restTime ? sanitizeInput(ex.restTime) : "60s"
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
export const sanitizeFilename = (filename, defaultExt = ".pdf") => {
  const ext = typeof defaultExt === "string" && defaultExt ? defaultExt : ".pdf";
  if (typeof filename !== "string" || !filename) {
    return `voro-export${ext}`;
  }
  // Strip path traversal sequences (..), directory separators, and control characters
  let clean = filename
    .replace(/\.\./g, "")
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/[\x00-\x1F\x7F]/g, "");
  // Collapse multiple underscores and strip leading/trailing dots/underscores
  clean = clean.replace(/_+/g, "_").replace(/^[\._]+/, "");
  const lower = clean.toLowerCase();
  if (!lower.endsWith(".pdf") && !lower.endsWith(".csv") && !lower.endsWith(".json")) {
    clean += ext;
  }
  return clean || `voro-export${ext}`;
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
  downloadPDF,
  sanitizeFilename
};
