import React, { useState, useEffect } from 'react';
import { Plus, Droplet, Trash2, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateWaterEntry } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LineChartComponent from '@/components/LineChartComponent';

const WaterTracker = () => {
  const { getItem, setItem } = useStorage();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [waterHistory, setWaterHistory] = useState([]);
  const [dailyGoal] = useState(2000);

  useEffect(() => {
    document.title = 'VORO | Water Tracker';
    loadWaterData();
  }, [date]);

  const loadWaterData = () => {
    const logs = getItem('voro_water_log') || {};
    const todayLogs = logs[date] || [];
    setDailyLogs(todayLogs);

    const all = getItem('voro_water_history') || {};
    const last30Days = Object.entries(all)
      .slice(-30)
      .map(([d, amount]) => ({
        date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        water: amount,
      }));
    setWaterHistory(last30Days);
  };

  const getTodayTotal = () => {
    return dailyLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
  };

  const addWater = (amount) => {
    // Security: Validate water intake before persisting to storage
    const { valid, errors } = validateWaterEntry({ amount, date });

    if (!valid) {
      const errorMsg = Object.values(errors).join('. ');
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const newLog = {
      id: `${Date.now()}`,
      amount,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [...dailyLogs, newLog];
    setDailyLogs(updatedLogs);

    const logs = getItem('voro_water_log') || {};
    logs[date] = updatedLogs;
    setItem('voro_water_log', logs);

    const history = getItem('voro_water_history') || {};
    const newTotal = updatedLogs.reduce((sum, log) => sum + log.amount, 0);
    history[date] = newTotal;
    setItem('voro_water_history', history);

    if (newTotal === dailyGoal) {
      addNotification('Hydration goal reached! 💧', 'success');
    }
  };

  const deleteLog = (id) => {
    const updated = dailyLogs.filter(log => log.id !== id);
    setDailyLogs(updated);

    const logs = getItem('voro_water_log') || {};
    logs[date] = updated;
    setItem('voro_water_log', logs);

    const history = getItem('voro_water_history') || {};
    history[date] = updated.reduce((sum, log) => sum + log.amount, 0);
    setItem('voro_water_history', history);
  };

  const handleDateChange = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const todayTotal = getTodayTotal();
  const percentage = Math.min((todayTotal / dailyGoal) * 100, 100);
  const displayDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Water Tracker</h1>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDateChange(-1)}
              aria-label="Go to previous day"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDateChange(1)}
              aria-label="Go to next day"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="text-gray-400 mb-6">{displayDate}</div>

        <Card className="mb-8 p-8 bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="text-sm text-gray-300 mb-2">DAILY INTAKE</div>
              <div className="text-5xl font-bold text-white mb-2">{todayTotal} ml</div>
              <div className="text-lg text-blue-200 mb-4">Goal: {dailyGoal} ml</div>
              <div className="w-full bg-voro-border rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-blue-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-400">{Math.round(percentage)}% of daily goal</div>
            </div>
            <Droplet className="text-blue-300" size={80} />
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center h-24"
            onClick={() => addWater(200)}
            aria-label="Add 200 ml of water"
          >
            <Plus size={24} className="mb-1" />
            <span className="text-sm">200 ml</span>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center h-24"
            onClick={() => addWater(250)}
            aria-label="Add 250 ml of water"
          >
            <Plus size={24} className="mb-1" />
            <span className="text-sm">250 ml</span>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center h-24"
            onClick={() => addWater(500)}
            aria-label="Add 500 ml of water"
          >
            <Plus size={24} className="mb-1" />
            <span className="text-sm">500 ml</span>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center h-24"
            onClick={() => addWater(750)}
            aria-label="Add 750 ml of water"
          >
            <Plus size={24} className="mb-1" />
            <span className="text-sm">750 ml</span>
          </Button>
        </div>

        <Card className="mb-8 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Droplet size={20} className="text-blue-400" />
            Today's Entries
          </h3>
          {dailyLogs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No water logged yet. Start by clicking above!</p>
          ) : (
            <div className="space-y-2">
              {dailyLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between bg-voro-card p-4 rounded-lg border border-voro-border">
                  <div className="flex items-center gap-3">
                    <Droplet size={20} className="text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{log.amount} ml</div>
                      <div className="text-sm text-gray-400">{log.time}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLog(log.id)}
                    className="text-red-400 hover:text-red-300"
                    aria-label={`Delete ${log.amount}ml entry logged at ${log.time}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {waterHistory.length > 1 && (
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                30-Day Trend
              </h3>
              <p className="text-sm text-gray-400">Your water intake over the past month</p>
            </div>
            <LineChartComponent
              data={waterHistory}
              dataKey="water"
              name="Water (ml)"
              color="#3B82F6"
              height={300}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default WaterTracker;
