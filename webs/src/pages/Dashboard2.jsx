import React, { useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

const Dashboard2 = () => {
  useEffect(() => {
    document.title = 'VORO | Alternative Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Alternative Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm text-blue-100">Nutrition Summary</div>
            <div className="text-2xl font-bold text-white mt-2">1,850 kcal</div>
            <div className="text-xs text-blue-100 mt-1">of 2,200 goal</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-sm text-green-100">Workout</div>
            <div className="text-2xl font-bold text-white mt-2">45 min</div>
            <div className="text-xs text-green-100 mt-1">Upper body push</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm text-purple-100">Progress</div>
            <div className="text-2xl font-bold text-white mt-2">↓ 2.5 kg</div>
            <div className="text-xs text-purple-100 mt-1">This month</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">Log Meal</Button>
              <Button variant="secondary" className="w-full justify-start">Log Workout</Button>
              <Button variant="secondary" className="w-full justify-start">Check Stats</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Today's Goals</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Calories</span>
                <span className="text-white font-semibold">84%</span>
              </div>
              <div className="w-full bg-voro-border rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '84%' }} />
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-400">Protein</span>
                <span className="text-white font-semibold">92%</span>
              </div>
              <div className="w-full bg-voro-border rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }} />
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-400">Water</span>
                <span className="text-white font-semibold">65%</span>
              </div>
              <div className="w-full bg-voro-border rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-400" style={{ width: '65%' }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
