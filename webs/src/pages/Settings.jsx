import React, { useEffect, useState, useMemo, useId } from 'react';
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

  const themeId = useId();
  const fontSizeId = useId();
  const accentColorId = useId();
  const weightUnitId = useId();
  const heightUnitId = useId();

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

  const labelStyle = "block text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-voro-primary transition-colors cursor-pointer mb-1";

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
            <div className="flex items-center justify-between group">
              <div>
                <label htmlFor={themeId} className={labelStyle}>Dark Mode</label>
                <p className="text-xs text-gray-400">Easy on the eyes</p>
              </div>
              <button
                id={themeId}
                onClick={toggleTheme}
                className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14] outline-none transition-all active:scale-90 rounded-lg p-1"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Moon size={20} className="text-voro-primary" />
                ) : (
                  <Sun size={20} className="text-yellow-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <label htmlFor={fontSizeId} className={labelStyle}>Font Size</label>
              </div>
              <Select
                id={fontSizeId}
                value={settings.fontSize || 'medium'}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                className="w-40"
              />
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <label htmlFor={accentColorId} className={labelStyle}>Accent Color</label>
              </div>
              <Select
                id={accentColorId}
                value={settings.accentColor || 'voro-primary'}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                options={[
                  { value: 'voro-primary', label: 'Violet' },
                  { value: 'voro-secondary', label: 'Emerald' },
                  { value: 'voro-accent', label: 'Amber' },
                ]}
                className="w-40"
              />
            </div>
          </div>
        </Card>

        {/* Unit Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Units</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <label htmlFor={weightUnitId} className={labelStyle}>Weight</label>
              <Select
                id={weightUnitId}
                value={settings.weightUnit || 'kg'}
                onChange={(e) => handleSettingChange('weightUnit', e.target.value)}
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lbs', label: 'Pounds (lbs)' },
                ]}
                className="w-40"
              />
            </div>
            <div className="flex items-center justify-between group">
              <label htmlFor={heightUnitId} className={labelStyle}>Height</label>
              <Select
                id={heightUnitId}
                value={settings.heightUnit || 'cm'}
                onChange={(e) => handleSettingChange('heightUnit', e.target.value)}
                options={[
                  { value: 'cm', label: 'Centimeters (cm)' },
                  { value: 'ft', label: 'Feet (ft)' },
                ]}
                className="w-40"
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
