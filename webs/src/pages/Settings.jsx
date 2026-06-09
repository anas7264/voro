import React, { useEffect, useState, useMemo } from 'react';
import { Moon, Sun, Settings as SettingsIcon, RotateCcw, Download, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

const Settings = () => {
  const { storageData, setStorage, exportData, clearAllData } = useStorage();
  const { user } = useApp();

  useEffect(() => {
    document.title = 'VORO | Settings';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Synchronous data derivation for user settings.
   * Eliminates mount-time double-render and ensures instant reactivity.
   */
  const settings = useMemo(() => {
    return storageData['settings'] || {};
  }, [storageData['settings']]);

  const theme = useMemo(() => {
    return settings.theme || 'dark';
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setStorage('settings', updated);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    handleSettingChange('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleExportData = () => {
    const backup = exportData();
    if (!backup) return;
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voro-backup-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleClearData = () => {
    const msg = 'Are you sure? This will delete all your data (profile, workouts, nutrition, chat history, etc.).';
    if (window.confirm(msg)) {
      if (clearAllData()) {
        alert('All data cleared successfully');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

        {/* Display Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon size={20} />
            Display
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white">Dark Mode</span>
                <p className="text-xs text-gray-400">Easy on the eyes</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'dark' ? (
                  <Moon size={20} className="text-voro-primary" />
                ) : (
                  <Sun size={20} className="text-yellow-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white">Font Size</span>
              </div>
              <Select
                value={settings.fontSize || 'medium'}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white">Accent Color</span>
              </div>
              <Select
                value={settings.accentColor || 'voro-primary'}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                options={[
                  { value: 'voro-primary', label: 'Violet' },
                  { value: 'voro-secondary', label: 'Emerald' },
                  { value: 'voro-accent', label: 'Amber' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Unit Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Units</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Weight</span>
              <Select
                value={settings.weightUnit || 'kg'}
                onChange={(e) => handleSettingChange('weightUnit', e.target.value)}
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lbs', label: 'Pounds (lbs)' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Height</span>
              <Select
                value={settings.heightUnit || 'cm'}
                onChange={(e) => handleSettingChange('heightUnit', e.target.value)}
                options={[
                  { value: 'cm', label: 'Centimeters (cm)' },
                  { value: 'ft', label: 'Feet (ft)' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Toggle
                label="Meal Reminders"
                enabled={settings.mealReminders !== false}
                onChange={(val) => handleSettingChange('mealReminders', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Toggle
                label="Workout Reminders"
                enabled={settings.workoutReminders !== false}
                onChange={(val) => handleSettingChange('workoutReminders', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Toggle
                label="Water Reminders"
                enabled={settings.waterReminders !== false}
                onChange={(val) => handleSettingChange('waterReminders', val)}
              />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleExportData}
            >
              <Download size={18} />
              Export Data
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Import Data
            </Button>
            <Button
              variant="danger"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleClearData}
            >
              <RotateCcw size={18} />
              Clear All Data
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 mt-6 text-center">
          <p className="text-gray-400">VORO v1.0.0</p>
          <p className="text-xs text-gray-500 mt-2">All data stored locally on your device</p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
