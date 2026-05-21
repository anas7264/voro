import React, { useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';

const Reports = () => {
  useEffect(() => {
    document.title = 'VORO | Reports';
  }, []);

  const reports = [
    { id: 1, name: 'Weekly Nutrition Report', icon: '📊', color: 'from-blue-600 to-blue-700' },
    { id: 2, name: 'Weekly Training Report', icon: '🏋️', color: 'from-purple-600 to-purple-700' },
    { id: 3, name: 'Monthly Progress Report', icon: '📈', color: 'from-green-600 to-green-700' },
    { id: 4, name: 'Body Composition Analysis', icon: '⚖️', color: 'from-orange-600 to-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {reports.map(report => (
            <Card key={report.id} className={`p-6 bg-gradient-to-br ${report.color}`}>
              <div className="text-3xl mb-3">{report.icon}</div>
              <h3 className="text-lg font-bold text-white mb-4">{report.name}</h3>
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Download size={16} />
                Generate PDF
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={20} />
            Export Data
          </h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              📥 Export Nutrition Log (CSV)
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              📥 Export Workout Log (CSV)
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              📥 Export All Data (JSON)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
