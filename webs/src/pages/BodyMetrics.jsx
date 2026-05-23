import React, { useState, useEffect } from 'react';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import LineChartComponent from '@/components/LineChartComponent';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { calculateBMI, calculateFFMI } from '@/utils/calculators';
import { isValidWeight, isValidBodyFat, isPositiveNumber } from '@/utils/validators';

const BodyMetrics = () => {
  const { getStorage, setStorage } = useStorage();
  const { user } = useApp();
  const { addNotification } = useNotifications();
  const [metrics, setMetrics] = useState(null);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    bicep: '',
    thigh: '',
    calf: '',
  });

  useEffect(() => {
    document.title = 'VORO | Body Metrics';
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    const data = getStorage('voro_body_metrics') || {
      weights: [],
      measurements: [],
      bodyFat: [],
      photos: [],
    };
    setMetrics(data);
  };

  const addWeight = () => {
    if (!weight) return;

    if (!isValidWeight(weight)) {
      addNotification('Invalid weight value. Must be between 30 and 500 kg.', 'error');
      return;
    }

    const allMetrics = getStorage('voro_body_metrics') || {
      weights: [],
      measurements: [],
      bodyFat: [],
      photos: [],
    };
    allMetrics.weights.push({
      date: new Date().toISOString(),
      value: Number(weight),
    });
    setStorage('voro_body_metrics', allMetrics);
    setWeight('');
    loadMetrics();
    addNotification('Weight logged successfully', 'success');
  };

  const addMeasurement = () => {
    // Validate all measurement fields
    const invalidFields = Object.entries(measurements).filter(([_, val]) => val && !isPositiveNumber(val));
    if (invalidFields.length > 0) {
      addNotification('All measurements must be positive numbers', 'error');
      return;
    }

    // Ensure at least one value is provided
    if (Object.values(measurements).every(v => v === '')) {
      addNotification('Please provide at least one measurement', 'info');
      return;
    }

    const allMetrics = getStorage('voro_body_metrics') || {
      weights: [],
      measurements: [],
      bodyFat: [],
      photos: [],
    };
    allMetrics.measurements.push({
      date: new Date().toISOString(),
      ...measurements,
    });
    setStorage('voro_body_metrics', allMetrics);
    setMeasurements({
      chest: '',
      waist: '',
      hips: '',
      bicep: '',
      thigh: '',
      calf: '',
    });
    loadMetrics();
    addNotification('Measurements saved successfully', 'success');
  };

  const addBodyFat = () => {
    if (!bodyFat) return;

    if (!isValidBodyFat(bodyFat)) {
      addNotification('Invalid body fat value. Must be between 0 and 100%.', 'error');
      return;
    }

    const allMetrics = getStorage('voro_body_metrics') || {
      weights: [],
      measurements: [],
      bodyFat: [],
      photos: [],
    };
    allMetrics.bodyFat.push({
      date: new Date().toISOString(),
      value: Number(bodyFat),
    });
    setStorage('voro_body_metrics', allMetrics);
    setBodyFat('');
    loadMetrics();
    addNotification('Body fat logged successfully', 'success');
  };

  if (!metrics) return <div className="p-8">Loading...</div>;

  const weightData = metrics.weights.slice(-30).map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.value,
  }));

  const bodyFatData = metrics.bodyFat.slice(-30).map(b => ({
    date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bodyFat: b.value,
  }));

  const latestWeight = metrics.weights[metrics.weights.length - 1]?.value;
  const latestBodyFat = metrics.bodyFat[metrics.bodyFat.length - 1]?.value;
  const bmi = latestWeight && user ? calculateBMI(latestWeight, user.heightCm) : null;
  const ffmi = latestWeight && latestBodyFat && user ? calculateFFMI(latestWeight, latestBodyFat, user.heightCm) : null;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Body Metrics</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Current Weight</div>
            <div className="text-3xl font-bold text-voro-primary">{latestWeight?.toFixed(1) || '-'}kg</div>
            {latestWeight && user && (
              <div className="text-xs text-gray-500 mt-2">Goal: {user.targetWeight?.toFixed(1)}kg</div>
            )}
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">Body Fat %</div>
            <div className="text-3xl font-bold text-voro-accent">{latestBodyFat?.toFixed(1) || '-'}%</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">BMI</div>
            <div className="text-3xl font-bold text-voro-secondary">{bmi?.toFixed(1) || '-'}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">FFMI</div>
            <div className="text-3xl font-bold text-voro-primary">{ffmi?.toFixed(1) || '-'}</div>
          </Card>
        </div>

        {/* Weight Trend */}
        {weightData.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Weight Trend (30 days)</h3>
            <LineChartComponent
              data={weightData}
              dataKey="weight"
              name="Weight (kg)"
              color="#7C3AED"
              height={300}
            />
          </Card>
        )}

        {/* Body Fat Trend */}
        {bodyFatData.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Body Fat Trend (30 days)</h3>
            <LineChartComponent
              data={bodyFatData}
              dataKey="bodyFat"
              name="Body Fat %"
              color="#F59E0B"
              height={300}
            />
          </Card>
        )}

        {/* Weight Entry */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Log Weight</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              className="flex-1"
            />
            <Button onClick={addWeight} className="flex items-center gap-2">
              <Plus size={18} />
              Add
            </Button>
          </div>
        </Card>

        {/* Body Fat Entry */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Log Body Fat %</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Body Fat %"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              step="0.1"
              className="flex-1"
            />
            <Button onClick={addBodyFat} className="flex items-center gap-2">
              <Plus size={18} />
              Add
            </Button>
          </div>
        </Card>

        {/* Measurements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Body Measurements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(measurements).map(([key, value]) => (
              <Input
                key={key}
                type="number"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                step="0.1"
              />
            ))}
          </div>
          <Button onClick={addMeasurement} className="w-full flex items-center justify-center gap-2">
            <Plus size={18} />
            Save Measurements
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BodyMetrics;
