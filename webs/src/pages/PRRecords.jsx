import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';
import { exercises } from '@/data/exercises';

const PRRecords = () => {
  const { getStorage } = useStorage();
  const [prs, setPrs] = useState([]);

  useEffect(() => {
    document.title = 'VORO | PR Records';
    const data = getStorage('voro_pr_history') || {};
    const allPrs = Object.entries(data).map(([exerciseId, records]) => ({
      exerciseId,
      exerciseName: exercises.find(e => e.id === exerciseId)?.name || 'Unknown',
      records: records.sort((a, b) => new Date(b.date) - new Date(a.date)),
    }));
    setPrs(allPrs);
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Personal Records</h1>

        {prs.length > 0 ? (
          <div className="space-y-6">
            {prs.map(item => (
              <Card key={item.exerciseId} className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">{item.exerciseName}</h3>
                <div className="space-y-2">
                  {item.records.map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-voro-surface rounded-lg">
                      <div>
                        <div className="font-semibold text-white">
                          {record.weight} kg × {record.reps} reps
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                      {idx === 0 && <Badge color="accent">🏆 Best</Badge>}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">No PRs yet</h3>
            <p className="text-gray-400 mb-6">Set your first personal record by logging workouts</p>
            <Button>Log Workout</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PRRecords;
