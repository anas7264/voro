import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { StorageProvider } from "./context/StorageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationContainer } from "./components/NotificationContainer";
import { LoadingSpinner } from "./components/LoadingSpinner";
import AppLayout from "./components/AppLayout";
import OnboardingGuard from "./components/OnboardingGuard";
import SecurityLockdown from "./components/SecurityLockdown";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FoodDiary = lazy(() => import("./pages/FoodDiary"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const FoodLibrary = lazy(() => import("./pages/FoodLibrary"));
const RecipeLibrary = lazy(() => import("./pages/RecipeLibrary"));
const RecipeBuilder = lazy(() => import("./pages/RecipeBuilder"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const NutrientTracker = lazy(() => import("./pages/NutrientTracker"));
const FoodJournal = lazy(() => import("./pages/FoodJournal"));
const MealPrepPlanner = lazy(() => import("./pages/MealPrepPlanner"));
const SavedMealPlans = lazy(() => import("./pages/SavedMealPlans"));
const ExerciseLibrary = lazy(() => import("./pages/ExerciseLibrary"));
const WorkoutLog = lazy(() => import("./pages/WorkoutLog"));
const WorkoutHistory = lazy(() => import("./pages/WorkoutHistory"));
const TrainingPlan = lazy(() => import("./pages/TrainingPlan"));
const SavedTrainingPlans = lazy(() => import("./pages/SavedTrainingPlans"));
const Periodization = lazy(() => import("./pages/Periodization"));
const GymSetup = lazy(() => import("./pages/GymSetup"));
const BodyMetrics = lazy(() => import("./pages/BodyMetrics"));
const BodyComposition = lazy(() => import("./pages/BodyComposition"));
const ProgressPhotos = lazy(() => import("./pages/ProgressPhotos"));
const VitalsTracker = lazy(() => import("./pages/VitalsTracker"));
const PRRecords = lazy(() => import("./pages/PRRecords"));
const Statistics = lazy(() => import("./pages/Statistics"));
const PerformanceMetrics = lazy(() => import("./pages/PerformanceMetrics"));
const Reports = lazy(() => import("./pages/Reports"));
const AICoach = lazy(() => import("./pages/AICoach"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Achievements = lazy(() => import("./pages/Achievements"));
const DailyStreak = lazy(() => import("./pages/DailyStreak"));
const HabitTracker = lazy(() => import("./pages/HabitTracker"));
const Calculators = lazy(() => import("./pages/Calculators"));
const EducationHub = lazy(() => import("./pages/EducationHub"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WaterTracker = lazy(() => import("./pages/WaterTracker"));
const FastingTracker = lazy(() => import("./pages/FastingTracker"));
const SupplementTracker = lazy(() => import("./pages/SupplementTracker"));
const CompetitionPrep = lazy(() => import("./pages/CompetitionPrep"));
const QuickLog = lazy(() => import("./pages/QuickLog"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
    <LoadingSpinner fullscreen />
  </div>
);

// Helper: page wrapped in layout + onboarding guard
const AppPage = ({ children }) => (
  <OnboardingGuard>
    <AppLayout>{children}</AppLayout>
  </OnboardingGuard>
);

export const App = () => {
  return (
    <StorageProvider>
      <AppProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Router>
              <SecurityLockdown />
              <NotificationContainer />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Root redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  {/* Public route – no layout, no guard */}
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/* Dashboard */}
                  <Route path="/dashboard" element={<AppPage><Dashboard /></AppPage>} />

                  {/* Nutrition */}
                  <Route path="/nutrition">
                    <Route index element={<Navigate to="/nutrition/diary" replace />} />
                    <Route path="diary"           element={<AppPage><FoodDiary /></AppPage>} />
                    <Route path="journal"         element={<AppPage><FoodJournal /></AppPage>} />
                    <Route path="planner"         element={<AppPage><MealPlanner /></AppPage>} />
                    <Route path="library"         element={<AppPage><FoodLibrary /></AppPage>} />
                    <Route path="recipes"         element={<AppPage><RecipeLibrary /></AppPage>} />
                    <Route path="recipe-builder"  element={<AppPage><RecipeBuilder /></AppPage>} />
                    <Route path="shopping-list"   element={<AppPage><ShoppingList /></AppPage>} />
                    <Route path="tracker"         element={<AppPage><NutrientTracker /></AppPage>} />
                    <Route path="meal-prep"       element={<AppPage><MealPrepPlanner /></AppPage>} />
                    <Route path="saved-plans"     element={<AppPage><SavedMealPlans /></AppPage>} />
                  </Route>

                  {/* Workout */}
                  <Route path="/workout">
                    <Route index element={<Navigate to="/workout/log" replace />} />
                    <Route path="log"           element={<AppPage><WorkoutLog /></AppPage>} />
                    <Route path="history"       element={<AppPage><WorkoutHistory /></AppPage>} />
                    <Route path="library"       element={<AppPage><ExerciseLibrary /></AppPage>} />
                    <Route path="plan"          element={<AppPage><TrainingPlan /></AppPage>} />
                    <Route path="plans"         element={<AppPage><SavedTrainingPlans /></AppPage>} />
                    <Route path="periodization" element={<AppPage><Periodization /></AppPage>} />
                    <Route path="gym-setup"     element={<AppPage><GymSetup /></AppPage>} />
                  </Route>

                  {/* Body */}
                  <Route path="/body">
                    <Route index element={<Navigate to="/body/metrics" replace />} />
                    <Route path="metrics"     element={<AppPage><BodyMetrics /></AppPage>} />
                    <Route path="composition" element={<AppPage><BodyComposition /></AppPage>} />
                    <Route path="photos"      element={<AppPage><ProgressPhotos /></AppPage>} />
                    <Route path="vitals"      element={<AppPage><VitalsTracker /></AppPage>} />
                    <Route path="pr-records"  element={<AppPage><PRRecords /></AppPage>} />
                  </Route>

                  {/* Analytics */}
                  <Route path="/analytics">
                    <Route index element={<Navigate to="/analytics/dashboard" replace />} />
                    <Route path="dashboard"   element={<AppPage><Statistics /></AppPage>} />
                    <Route path="performance" element={<AppPage><PerformanceMetrics /></AppPage>} />
                    <Route path="reports"     element={<AppPage><Reports /></AppPage>} />
                  </Route>

                  {/* Gamification */}
                  <Route path="/gamification">
                    <Route index element={<Navigate to="/gamification/challenges" replace />} />
                    <Route path="challenges"  element={<AppPage><Challenges /></AppPage>} />
                    <Route path="achievements" element={<AppPage><Achievements /></AppPage>} />
                    <Route path="streak"      element={<AppPage><DailyStreak /></AppPage>} />
                    <Route path="habits"      element={<AppPage><HabitTracker /></AppPage>} />
                  </Route>

                  {/* Tools & single pages */}
                  <Route path="/ai-coach"    element={<AppPage><AICoach /></AppPage>} />
                  <Route path="/calculators" element={<AppPage><Calculators /></AppPage>} />
                  <Route path="/education"   element={<AppPage><EducationHub /></AppPage>} />
                  <Route path="/profile"     element={<AppPage><Profile /></AppPage>} />
                  <Route path="/settings"    element={<AppPage><Settings /></AppPage>} />
                  <Route path="/water"       element={<AppPage><WaterTracker /></AppPage>} />
                  <Route path="/fasting"     element={<AppPage><FastingTracker /></AppPage>} />
                  <Route path="/supplements" element={<AppPage><SupplementTracker /></AppPage>} />
                  <Route path="/competition" element={<AppPage><CompetitionPrep /></AppPage>} />
                  <Route path="/quick-log"   element={<AppPage><QuickLog /></AppPage>} />

                  {/* 404 */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*"    element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </AppProvider>
    </StorageProvider>
  );
};

export default App;
