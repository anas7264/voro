// VORO PDF Export
// PDF generation with VORO branding for reports and plans

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

// Generate PDF with VORO header
const addVOROHeader = (doc, title, subtitle = "") => {
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
  doc.text(title, 50, 20);

  // Subtitle if provided
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(subtitle, 50, 28);
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
  doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 8);
};

// Export Weekly Report
export const exportWeeklyReport = (userData, workouts, nutrition) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Header
  yPosition = addVOROHeader(doc, "Weekly Report", `${userData.name} - Week of ${new Date().toLocaleDateString()}`);
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
    doc.text(`${item[0]}: `, 15, yPosition);
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
      w.type,
      w.duration,
      w.volume || "-",
      w.notes ? w.notes.substring(0, 20) + "..." : "-"
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
export const exportMonthlyReport = (userData, allWorkouts, allNutrition, metrics) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Header
  yPosition = addVOROHeader(doc, "Monthly Report", `${userData.name} - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`);
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
    doc.text(`${item[0]}: `, 15, yPosition);
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
    workoutTypes[w.type] = (workoutTypes[w.type] || 0) + 1;
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
export const exportMealPlan = (mealPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;

  // Header
  yPosition = addVOROHeader(doc, "Meal Plan", `${userData.name} - 7 Day Plan`);
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
      meal.type,
      meal.name,
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
export const exportTrainingPlan = (trainingPlan, userData) => {
  const doc = new jsPDF();
  let yPosition = 10;
  let pageNum = 1;

  // Header
  yPosition = addVOROHeader(doc, "Training Plan", `${userData.name} - 4 Week Periodization`);
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
  doc.text(`Goal: ${userData.goal} | Experience: ${userData.experienceLevel} | Days/Week: ${userData.availableDays}`, 15, yPosition);
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
      doc.text(`${workout.day}: ${workout.type}`, 15, yPosition);
      yPosition += 5;

      const exerciseData = workout.exercises.map(ex => [
        ex.name,
        `${ex.sets}x${ex.reps}`,
        ex.weight ? `${ex.weight}kg` : "Bodyweight",
        ex.restTime || "60s"
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

// Save PDF to file
export const savePDF = (doc, filename) => {
  doc.save(filename);
};

// Download PDF directly
export const downloadPDF = (doc, filename) => {
  const element = document.createElement("a");
  element.href = doc.output("datauristring");
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
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
