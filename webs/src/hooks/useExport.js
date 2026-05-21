import { useState, useCallback } from "react";
import { useStorage } from "./useStorage";
import * as pdfExport from "../utils/pdfExport";

export const useExport = () => {
  const { getItem } = useStorage();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [exportProgress, setExportProgress] = useState(0);

  // Export weekly report as PDF
  const exportWeeklyReportPDF = useCallback(async (userData, workouts, nutrition) => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      setExportProgress(30);
      const doc = pdfExport.exportWeeklyReport(userData, workouts, nutrition);

      setExportProgress(80);
      const filename = `VORO-Weekly-Report-${new Date().toISOString().split("T")[0]}.pdf`;
      pdfExport.downloadPDF(doc, filename);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export weekly report";
      setError(errorMessage);
      setExporting(false);
      console.error("Weekly report export error:", err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Export monthly report as PDF
  const exportMonthlyReportPDF = useCallback(async (userData, allWorkouts, allNutrition, metrics) => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      setExportProgress(30);
      const doc = pdfExport.exportMonthlyReport(userData, allWorkouts, allNutrition, metrics);

      setExportProgress(80);
      const filename = `VORO-Monthly-Report-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}.pdf`;
      pdfExport.downloadPDF(doc, filename);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export monthly report";
      setError(errorMessage);
      setExporting(false);
      console.error("Monthly report export error:", err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Export meal plan as PDF
  const exportMealPlanPDF = useCallback(async (mealPlan, userData) => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      setExportProgress(30);
      const doc = pdfExport.exportMealPlan(mealPlan, userData);

      setExportProgress(80);
      const filename = `VORO-Meal-Plan-${new Date().toISOString().split("T")[0]}.pdf`;
      pdfExport.downloadPDF(doc, filename);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export meal plan";
      setError(errorMessage);
      setExporting(false);
      console.error("Meal plan export error:", err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Export training plan as PDF
  const exportTrainingPlanPDF = useCallback(async (trainingPlan, userData) => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      setExportProgress(30);
      const doc = pdfExport.exportTrainingPlan(trainingPlan, userData);

      setExportProgress(80);
      const filename = `VORO-Training-Plan-${new Date().toISOString().split("T")[0]}.pdf`;
      pdfExport.downloadPDF(doc, filename);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export training plan";
      setError(errorMessage);
      setExporting(false);
      console.error("Training plan export error:", err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Export nutrition log as CSV
  const exportNutritionLogCSV = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      const nutritionLog = getItem("nutritionLog") || [];
      setExportProgress(40);

      let csv = "Date,Meal Type,Food,Calories,Protein(g),Carbs(g),Fat(g),Notes\n";

      nutritionLog.forEach(entry => {
        csv += `"${entry.date}","${entry.mealType}","${entry.food}",${entry.calories},${entry.protein},${entry.carbs},${entry.fat},"${entry.notes || ""}"\n`;
      });

      setExportProgress(80);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `VORO-Nutrition-Log-${new Date().toISOString().split("T")[0]}.csv`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export nutrition log";
      setError(errorMessage);
      setExporting(false);
      console.error("Nutrition log export error:", err);
      return { success: false, error: errorMessage };
    }
  }, [getItem]);

  // Export workout log as CSV
  const exportWorkoutLogCSV = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      const workoutLog = getItem("workoutLog") || [];
      setExportProgress(40);

      let csv = "Date,Exercise,Category,Sets,Reps,Weight(kg),Duration(min),Notes\n";

      workoutLog.forEach(entry => {
        csv += `"${entry.date}","${entry.exercise}","${entry.category}",${entry.sets},${entry.reps},${entry.weight},${entry.duration},"${entry.notes || ""}"\n`;
      });

      setExportProgress(80);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `VORO-Workout-Log-${new Date().toISOString().split("T")[0]}.csv`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export workout log";
      setError(errorMessage);
      setExporting(false);
      console.error("Workout log export error:", err);
      return { success: false, error: errorMessage };
    }
  }, [getItem]);

  // Export all data as JSON backup
  const exportAllDataJSON = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      const profile = getItem("profile");
      const workoutLog = getItem("workoutLog");
      const nutritionLog = getItem("nutritionLog");
      const bodyMetrics = getItem("bodyMetrics");
      const gamification = getItem("gamification");

      setExportProgress(50);

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
          profile,
          workoutLog,
          nutritionLog,
          bodyMetrics,
          gamification
        }
      };

      setExportProgress(80);

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `VORO-Backup-${new Date().toISOString().split("T")[0]}.json`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export backup";
      setError(errorMessage);
      setExporting(false);
      console.error("Backup export error:", err);
      return { success: false, error: errorMessage };
    }
  }, [getItem]);

  // Export body measurements as CSV
  const exportMeasurementsCSV = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress(0);

      const bodyMetrics = getItem("bodyMetrics") || [];
      setExportProgress(40);

      let csv = "Date,Weight(kg),Chest(cm),Waist(cm),Hips(cm),Arm(cm),Thigh(cm),Body Fat(%),Notes\n";

      bodyMetrics.forEach(entry => {
        csv += `"${entry.date}",${entry.weight},${entry.chest || ""},${entry.waist || ""},${entry.hips || ""},${entry.arm || ""},${entry.thigh || ""},${entry.bodyFat || ""},"${entry.notes || ""}"\n`;
      });

      setExportProgress(80);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `VORO-Measurements-${new Date().toISOString().split("T")[0]}.csv`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      setExporting(false);

      return { success: true, filename };
    } catch (err) {
      const errorMessage = err.message || "Failed to export measurements";
      setError(errorMessage);
      setExporting(false);
      console.error("Measurements export error:", err);
      return { success: false, error: errorMessage };
    }
  }, [getItem]);

  return {
    exporting,
    error,
    exportProgress,
    exportWeeklyReportPDF,
    exportMonthlyReportPDF,
    exportMealPlanPDF,
    exportTrainingPlanPDF,
    exportNutritionLogCSV,
    exportWorkoutLogCSV,
    exportMeasurementsCSV,
    exportAllDataJSON
  };
};

export default useExport;
