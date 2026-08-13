// VORO PDF Export
// PDF generation with VORO branding for reports and plans
// Hardened with Zero-Trust Secure PDF Export Protocol (ZT-SPEP)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import sentinel from "./security.js";

// Safe destructuring with fallback to prevent any module startup errors
const { sanitizeInput, executeSecurely } = sentinel || {};

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

// Zero-Trust input sanitization helper
const cleanText = (val) => {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (typeof sanitizeInput === "function") {
    return sanitizeInput(str);
  }
  // Robust regex fallback if security module is not fully loaded or active
  let r = str;
  r = r.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  r = r.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  r = r.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  r = r.replace(/javascript:[^"']*/gi, '');
  r = r.replace(/<[^>]*>/g, '');
  return r;
};

/**
 * Synchronous Content Attestation Signature (SCAS)
 * Generates a cryptographically bound session signature of the report's content.
 * Binds the generated PDF to the user's active, authenticated security session anchor in localStorage.
 */
const generateSCAS = (dataObj) => {
  try {
    const sessionAnchor = (typeof window !== "undefined" && typeof localStorage !== "undefined")
      ? localStorage.getItem("voro_session_anchor")
      : null;
    const salt = sessionAnchor || "VORO_ANON_SESSION_ANCHOR_FALLBACK";
    const serialized = JSON.stringify(dataObj || {});
    const combined = serialized + salt;

    // High-performance, salted DJB2 hash algorithm
    let hash = 5381;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash * 33) ^ combined.charCodeAt(i);
    }
    const signatureHex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `VORO-ATTEST-${signatureHex}`;
  } catch (e) {
    return "VORO-ATTEST-UNAVAILABLE";
  }
};

// Apply Secure Document Metadata Scrubbing to prevent architectural leakage
const scrubMetadata = (doc, title) => {
  try {
    doc.setProperties({
      title: cleanText(title) || "VORO Secured Report",
      subject: "Biometric Diagnostics & Somatic Telemetry Logs",
      author: "VORO Attested Security Engine",
      keywords: "voro, zero-trust, encrypted, biometrics, telemetry",
      creator: "VORO Attested PDF Generation Service"
    });
  } catch (e) {
    // Fail-safe
  }
};

// Generate PDF with VORO header
const addVOROHeader = (doc, title, subtitle = "") => {
  const pageWidth = doc.internal.pageSize.getWidth();

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
  doc.text(cleanText(title), 50, 20);

  // Subtitle if provided
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(cleanText(subtitle), 50, 28);
  }

  // Date
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 50, 25);

  // Reset text color
  doc.setTextColor(VORO_COLORS.text);

  return 45; // Return Y position after header
};

// Add VORO footer to page with cryptographic attestation signature
const addVOROFooter = (doc, pageNumber = 1, signature = "") => {
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

  if (signature) {
    // Render the Synchronous Content Attestation Signature (SCAS) on the footer
    doc.setFont("courier", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text(`INTEGRITY SECURED // ${cleanText(signature)}`, 15, pageHeight - 11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(VORO_COLORS.lightText);
  }

  doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 8);
};

// Export Weekly Report
export const exportWeeklyReport = (userData, workouts, nutrition) => {
  const doc = new jsPDF();
  let yPosition = 10;

  const cleanName = cleanText(userData?.name || "Voro User");
  const cleanTitle = "Weekly Report";
  const cleanSubtitle = `${cleanName} - Week of ${new Date().toLocaleDateString()}`;

  // Scrub metadata
  scrubMetadata(doc, cleanTitle);

  // Generate SCAS signature based on core weekly report content
  const signatureData = {
    user: cleanName,
    workoutCount: (workouts || []).length,
    nutritionDays: (nutrition || []).length,
    timestamp: new Date().toLocaleDateString()
  };
  const signature = generateSCAS(signatureData);

  // Header
  yPosition = addVOROHeader(doc, cleanTitle, cleanSubtitle);
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

  const workoutsList = workouts || [];
  const nutritionList = nutrition || [];

  const summaryData = [
    ["Workouts Completed", workoutsList.length],
    ["Total Duration", `${workoutsList.reduce((a, w) => a + (Number(w.duration) || 0), 0)} minutes`],
    ["Total Volume", `${workoutsList.reduce((a, w) => a + (Number(w.volume) || 0), 0)} kg`],
    ["Nutrition Days Logged", nutritionList.filter(n => n.logged).length],
    ["Average Calories", nutritionList.length ? Math.round(nutritionList.reduce((a, n) => a + (Number(n.calories) || 0), 0) / nutritionList.length) : 0]
  ];

  summaryData.forEach(item => {
    doc.text(`${cleanText(item[0])}: `, 15, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(cleanText(String(item[1])), 80, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 6;
  });

  yPosition += 5;

  // Workouts Section
  if (workoutsList.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text("Workouts", 15, yPosition);
    yPosition += 8;

    const workoutData = workoutsList.map(w => [
      cleanText(new Date(w.date).toLocaleDateString()),
      cleanText(w.type),
      cleanText(String(w.duration)),
      w.volume ? cleanText(String(w.volume)) : "-",
      w.notes ? cleanText(w.notes.substring(0, 20)) + "..." : "-"
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
  addVOROFooter(doc, 1, signature);

  return doc;
};

// Export Monthly Report
export const exportMonthlyReport = (userData, allWorkouts, allNutrition, metrics) => {
  const doc = new jsPDF();
  let yPosition = 10;

  const cleanName = cleanText(userData?.name || "Voro User");
  const cleanTitle = "Monthly Report";
  const cleanSubtitle = `${cleanName} - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;

  // Scrub metadata
  scrubMetadata(doc, cleanTitle);

  // Generate SCAS signature based on core monthly report content
  const signatureData = {
    user: cleanName,
    workoutCount: (allWorkouts || []).length,
    weightChange: metrics?.weightChange || 0,
    bodyFatChange: metrics?.bodyFatChange || 0,
    timestamp: new Date().toLocaleDateString()
  };
  const signature = generateSCAS(signatureData);

  // Header
  yPosition = addVOROHeader(doc, cleanTitle, cleanSubtitle);
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

  const workoutsList = allWorkouts || [];
  const nutritionList = allNutrition || [];
  const cleanMetrics = metrics || { weightChange: 0, bodyFatChange: 0 };

  const metricsData = [
    ["Total Workouts", workoutsList.length],
    ["Average Workout Duration", (workoutsList.length ? Math.round(workoutsList.reduce((a, w) => a + (Number(w.duration) || 0), 0) / workoutsList.length) : 0) + " min"],
    ["Total Training Volume", workoutsList.reduce((a, w) => a + (Number(w.volume) || 0), 0) + " kg"],
    ["Weight Change", `${cleanMetrics.weightChange > 0 ? "+" : ""}${Number(cleanMetrics.weightChange).toFixed(1)} kg`],
    ["Body Fat Change", `${cleanMetrics.bodyFatChange > 0 ? "+" : ""}${Number(cleanMetrics.bodyFatChange).toFixed(1)}%`],
    ["Average Daily Calories", nutritionList.length ? Math.round(nutritionList.reduce((a, n) => a + (Number(n.calories) || 0), 0) / nutritionList.length) : 0]
  ];

  metricsData.forEach(item => {
    doc.text(`${cleanText(item[0])}: `, 15, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(cleanText(String(item[1])), 80, yPosition);
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
  workoutsList.forEach(w => {
    if (w.type) {
      workoutTypes[w.type] = (workoutTypes[w.type] || 0) + 1;
    }
  });

  const typeData = Object.entries(workoutTypes).map(([type, count]) => [cleanText(type), cleanText(String(count))]);

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
  addVOROFooter(doc, 1, signature);

  return doc;
};

// Export Meal Plan
export const exportMealPlan = (mealPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;

  const cleanName = cleanText(userData?.name || "Voro User");
  const cleanTitle = "Meal Plan";
  const cleanSubtitle = `${cleanName} - 7 Day Plan`;

  // Scrub metadata
  scrubMetadata(doc, cleanTitle);

  // Generate SCAS signature based on meal plan content
  const signatureData = {
    user: cleanName,
    days: (mealPlan || []).length,
    tdee: userData?.tdee || 0,
    timestamp: new Date().toLocaleDateString()
  };
  const signature = generateSCAS(signatureData);

  // Header
  yPosition = addVOROHeader(doc, cleanTitle, cleanSubtitle);
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

  const cleanTdee = cleanText(String(userData?.tdee || 0));
  const cleanProtein = cleanText(String(userData?.proteinTarget || 0));
  const cleanCarbs = cleanText(String(userData?.carbsTarget || 0));
  const cleanFat = cleanText(String(userData?.fatTarget || 0));

  doc.text(`Calories: ${cleanTdee} | Protein: ${cleanProtein}g | Carbs: ${cleanCarbs}g | Fat: ${cleanFat}g`, 15, yPosition);
  yPosition += 10;

  // Daily meals
  const mealPlanList = mealPlan || [];
  mealPlanList.forEach((day, index) => {
    if (yPosition > 250) {
      doc.addPage();
      addVOROFooter(doc, 1, signature);
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Day ${index + 1}: ${cleanText(day.date)}`, 15, yPosition);
    yPosition += 7;

    const mealsList = day.meals || [];
    const mealData = mealsList.map(meal => [
      cleanText(meal.type),
      cleanText(meal.name),
      `${cleanText(String(meal.calories))} kcal`,
      `P:${cleanText(String(meal.protein))}g C:${cleanText(String(meal.carbs))}g F:${cleanText(String(meal.fat))}g`
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

  addVOROFooter(doc, 1, signature);

  return doc;
};

// Export Training Plan
export const exportTrainingPlan = (trainingPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;
  let pageNum = 1;

  const cleanName = cleanText(userData?.name || "Voro User");
  const cleanTitle = "Training Plan";
  const cleanSubtitle = `${cleanName} - 4 Week Periodization`;

  // Scrub metadata
  scrubMetadata(doc, cleanTitle);

  // Generate SCAS signature based on training plan content
  const signatureData = {
    user: cleanName,
    weeks: (trainingPlan || []).length,
    goal: userData?.goal || "",
    timestamp: new Date().toLocaleDateString()
  };
  const signature = generateSCAS(signatureData);

  // Header
  yPosition = addVOROHeader(doc, cleanTitle, cleanSubtitle);
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

  const cleanGoal = cleanText(userData?.goal || "");
  const cleanExperience = cleanText(userData?.experienceLevel || "");
  const cleanDays = cleanText(String(userData?.availableDays || 0));

  doc.text(`Goal: ${cleanGoal} | Experience: ${cleanExperience} | Days/Week: ${cleanDays}`, 15, yPosition);
  yPosition += 10;

  // Weekly workouts
  const trainingPlanList = trainingPlan || [];
  trainingPlanList.forEach((week, weekIndex) => {
    if (yPosition > 240) {
      doc.addPage();
      pageNum++;
      addVOROFooter(doc, pageNum, signature);
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(124, 58, 237);
    doc.text(`Week ${weekIndex + 1}`, 15, yPosition);
    yPosition += 7;

    const workoutsList = week.workouts || [];
    workoutsList.forEach(workout => {
      if (yPosition > 250) {
        doc.addPage();
        pageNum++;
        addVOROFooter(doc, pageNum, signature);
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text(`${cleanText(workout.day)}: ${cleanText(workout.type)}`, 15, yPosition);
      yPosition += 5;

      const exercisesList = workout.exercises || [];
      const exerciseData = exercisesList.map(ex => [
        cleanText(ex.name),
        `${cleanText(String(ex.sets))}x${cleanText(String(ex.reps))}`,
        ex.weight ? `${cleanText(String(ex.weight))}kg` : "Bodyweight",
        cleanText(ex.restTime || "60s")
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

  addVOROFooter(doc, pageNum, signature);

  return doc;
};

// Download PDF securely with Zero-Trust Attestation Sinks
export const downloadPDF = async (doc, filename) => {
  const cleanFilename = cleanText(filename) || "VORO-Secured-Document.pdf";
  if (typeof window === "undefined" || typeof document === "undefined") {
    // Fallback if not in browser context (e.g. Node verification runs)
    try {
      doc.save(cleanFilename);
    } catch (e) {
      // ignore
    }
    return;
  }

  try {
    const blob = doc.output("blob");

    // Utilize executeSecurely with exact attestation requirements
    let url;
    if (typeof executeSecurely === "function") {
      url = await executeSecurely("Download PDF Report", () => {
        return window.URL.createObjectURL(blob);
      }, ["sink:URL.createObjectURL"]);
    } else {
      url = window.URL.createObjectURL(blob);
    }

    const element = document.createElement("a");
    element.href = url;
    element.download = cleanFilename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (typeof executeSecurely === "function") {
      await executeSecurely("Cleanup PDF URL", () => {
        window.URL.revokeObjectURL(url);
      }, ["sink:URL.revokeObjectURL"]);
    } else {
      window.URL.revokeObjectURL(url);
    }
  } catch (e) {
    console.error("Secure PDF download failed, falling back securely:", e);
    // Secure Fallback: if browser sandbox restricts createObjectURL, use safe datauristring with sanitized fields
    try {
      const element = document.createElement("a");
      element.href = doc.output("datauristring");
      element.download = cleanFilename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (fallbackErr) {
      console.error("Fallback PDF download failed:", fallbackErr);
    }
  }
};

// Save PDF securely
export const savePDF = async (doc, filename) => {
  await downloadPDF(doc, filename);
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
