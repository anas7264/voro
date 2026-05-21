import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Flame, Zap, Droplets, Calendar } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { useStorage } from '@/hooks/useStorage';
import { useAI } from '@/hooks/useAI';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Stat from '@/components/Stat';
import LineChartComponent from '@/components/LineChartComponent';
import Ring from '@/components/Ring';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAppContext();
  const { getItem } = useStorage();
  const { response: aiInsight, loading: aiLoading } = useAI();
  
  const [nutritionToday, setNutritionToday] = useState(null);
  const [workoutToday, setWorkoutToday] = useState(null);
  const [weightTrend, setWeightTrend] = useState([]);
  const [streaks, setStreaks] = useState({ training: 0, logging: 0, water: 0 });
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [quickLogType, setQuickLogType] = useState('meal');

  useEffect(() => {
    document.title = 'VORO | Dashboard';
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const today = new Date().toISOString().split('T')[0];
    const nutritionLog = getItem('voro_nutrition_log') || {};
    const todayNutrition = nutritionLog[today] || {
      meals: {},
      water: 0,
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
    setNutritionToday(todayNutrition);

    const workoutLog = getItem('voro_workout_log') || {};
    const todayWorkout = workoutLog[today];
    setWorkoutToday(todayWorkout);

    const metrics = getItem('voro_body_metrics') || {};
    const weights = metrics.weights || [];
    const last30 = weights.slice(-30).map(w => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.value,
      fullDate: w.date
    }));
    setWeightTrend(last30);

    calculateStreaks();
  };

  const calculateStreaks = () => {
    const workoutLog = getItem('voro_workout_log') || {};
    const nutritionLog = getItem('voro_nutrition_log') || {};
    
    let trainingStreak = 0;
    let loggingStreak = 0;
    let waterStreak = 0;
    
    let date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (workoutLog[dateStr]?.attended) trainingStreak++;
      else if (trainingStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (nutritionLog[dateStr]?.totals?.calories > 0) loggingStreak++;
      else if (loggingStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    date = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (nutritionLog[dateStr]?.water >= (user?.waterGoal || 2000)) waterStreak++;
      else if (waterStreak > 0) break;
      date.setDate(date.getDate() - 1);
    }

    setStreaks({ training: trainingStreak, logging: loggingStreak, water: waterStreak });
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCalorieStatus = () => {
    if (!nutritionToday || !user) return { status: 'neutral', remaining: user?.calorieGoal || 2000 };
    const remaining = (user.calorieGoal || 2000) - (nutritionToday.totals?.calories || 0);
    return {
      status: remaining > 0 ? 'under' : 'over',
      remaining: Math.abs(remaining)
    };
  };

  const getMacroProgress = (macro) => {
    if (!nutritionToday || !user) return 0;
    const goal = user[`${macro}Goal`] || 0;
    const actual = nutritionToday.totals?.[macro] || 0;
    return Math.min((actual / goal) * 100, 100);
  };

  const calorieStatus = getCalorieStatus();
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getTimeGreeting()}, {user.name}!
          </h1>
          <p className="text-gray-400">{todayDate}</p>
        </div>

        {/* Main Calorie Hero */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-voro-card to-voro-surface border border-voro-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <Ring
                value={(nutritionToday?.totals?.calories || 0)}
                max={user.calorieGoal}
                size={180}
                unit="kcal"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm text-gray-400 mb-2">CALORIES TODAY</div>
              <div className="text-5xl font-bold text-white mb-2">
                {nutritionToday?.totals?.calories || 0}
              </div>
              <div className="text-lg text-gray-300 mb-4">
                {calorieStatus.remaining} kcal {calorieStatus.status === 'under' ? 'remaining' : 'over'}
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => { setQuickLogType('meal'); setShowQuickLog(true); }}>
                  <Plus size={16} className="mr-2" />
                  Log Meal
                </Button>
                <Button variant="secondary" size="sm">View Details</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Macros Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Protein', macro: 'protein', color: 'voro-primary', icon: '🍗' },
            { label: 'Carbs', macro: 'carbs', color: 'voro-secondary', icon: '🍚' },
            { label: 'Fat', macro: 'fat', color: 'voro-accent', icon: '🥑' },
            { label: 'Water', macro: 'water', color: 'info', icon: '💧' }
          ].map((item) => (
            <Card key={item.macro} className="p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-gray-400 mb-2">{item.label.toUpperCase()}</div>
              <div className="text-2xl font-bold text-white mb-2">
                {item.macro === 'water' 
                  ? Math.round((nutritionToday?.water || 0) / 1000 * 10) / 10 
                  : nutritionToday?.totals?.[item.macro] || 0
                }
              </div>
              <div className="w-full bg-voro-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${item.color} transition-all`}
                  style={{ width: `${getMacroProgress(item.macro)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getMacroProgress(item.macro))}% of goal
              </div>
            </Card>
          ))}
        </div>

        {/* Streaks & Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-orange-900 to-orange-950 border border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300 mb-2">TRAINING STREAK</div>
                <div className="text-4xl font-bold text-orange-300">{streaks.training}</div>
                <div className="text-xs text-gray-400 mt-1">days 🔥</div>
              </div>
              <Flame className="text-orange-400" size={48} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-900 to-yellow-950 border border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300 mb-2">LOGGING STREAK</div>
                <div className="text-4xl font-bold text-yellow-300">{streaks.logging}</div>
                <div className="text-xs text-gray-400 mt-1">days ⚡</div>
              </div>
              <Zap className="text-yellow-400" size={48} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300 mb-2">WATER STREAK</div>
                <div className="text-4xl font-bold text-blue-300">{streaks.water}</div>
                <div className="text-xs text-gray-400 mt-1">days 💧</div>
              </div>
              <Droplets className="text-blue-400" size={48} />
            </div>
          </Card>
        </div>

        {/* Weight Trend */}
        {weightTrend.length > 0 && (
          <Card className="mb-8 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Weight Trend (30 days)</h3>
              <p className="text-sm text-gray-400">
                {weightTrend.length > 1 
                  ? `Change: ${((weightTrend[weightTrend.length - 1].weight - weightTrend[0].weight)).toFixed(1)} kg`
                  : 'Tracking your progress'
                }
              </p>
            </div>
            <LineChartComponent
              data={weightTrend}
              dataKey="weight"
              name="Weight (kg)"
              color="#7C3AED"
              height={300}
            />
          </Card>
        )}

        {/* Workout Status & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Workout Today</h3>
              <Calendar size={20} className="text-gray-400" />
            </div>
            {workoutToday?.attended ? (
              <div>
                <Badge color="success" className="mb-3">✓ Completed</Badge>
                <div className="text-sm text-gray-300">
                  <p>Type: {workoutToday.type}</p>
                  <p>Duration: {workoutToday.duration} min</p>
                  <p>Exercises: {workoutToday.exercises?.length || 0}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">No workout logged yet</p>
                <Button onClick={() => navigate('/workout/log')} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Log Workout
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate('/nutrition/diary')}>
                📊 Nutrition
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate('/workout/log')}>
                🏋️ Workout
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate('/body/metrics')}>
                ⚖️ Weight
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate('/ai-coach')}>
                🤖 Coach
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Insight */}
        {!aiLoading && (
          <Card className="p-6 border border-voro-primary border-opacity-30 bg-voro-primary bg-opacity-5">
            <h3 className="text-lg font-semibold text-white mb-3">💡 AI Insight</h3>
            <p className="text-gray-300">
              Keep up the consistency! You're on track with your logging streak. 
              Focus on hitting your protein goal to maximize your {user.primaryGoal.toLowerCase()} progress.
            </p>
          </Card>
        )}

        {/* Quick Log Modal */}
        {showQuickLog && (
          <QuickLogModal
            isOpen={showQuickLog}
            onClose={() => setShowQuickLog(false)}
            onSuccess={() => {
              loadDashboardData();
              setShowQuickLog(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

const QuickLogModal = ({ isOpen, onClose, onSuccess }) => {
  const [type, setType] = useState('meal');
  const [value, setValue] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Log">
      <div className="space-y-4">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'meal', label: 'Meal' },
            { value: 'weight', label: 'Weight' },
            { value: 'water', label: 'Water' },
          ]}
        />
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === 'meal' ? 'Calories' : type === 'weight' ? 'kg' : 'ml'}
        />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onSuccess} className="flex-1">Log</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
