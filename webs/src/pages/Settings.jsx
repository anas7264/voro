import React, { useEffect, useMemo, useId, useCallback } from 'react';
import { Moon, Sun, Settings as SettingsIcon, RotateCcw, Download, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useAppContext as useApp } from '@/hooks/useAppContext';
import { executeSecurely } from '@/utils/security';
import { useNotifications } from '@/hooks/useNotifications';

const Settings = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('settings') to isolate re-renders.
   * useStorageMethods provides stable references for write operations.
   */
  const settings = useStorageKey('settings') || {};
  const { setItem, deleteItem } = useStorageMethods();
  // Retrieve exportData and clearAllData securely from useStorageMethods without subscribing to volatile storageState.
  const { exportData, clearAllData } = useStorageMethods();

  const { user } = useApp();
  const { addNotification } = useNotifications();

  const themeId = useId();
  const fontSizeId = useId();
  const accentColorId = useId();
  const weightUnitId = useId();
  const heightUnitId = useId();

  useEffect(() => {
    document.title = 'VORO | System Configuration';
  }, []);

  const theme = useMemo(() => settings.theme || 'dark', [settings.theme]);

  const handleSettingChange = useCallback(async (key, value) => {
    const updated = { ...settings, [key]: value };
    await setItem('settings', updated);

    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', value === 'dark');
    }

    addNotification('System parameters synchronized', 'success');
  }, [settings, setItem, addNotification]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    handleSettingChange('theme', newTheme);
  }, [theme, handleSettingChange]);

  const handleExportData = async () => {
    const backup = await exportData();
    if (!backup) return;
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const url = await executeSecurely("Export Settings Backup", () => {
      return URL.createObjectURL(blob);
    }, ["sink:URL.createObjectURL"]);

    const a = document.createElement('a');
    a.href = url;
    a.download = `voro-evolution-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    await executeSecurely("Cleanup Settings Backup URL", () => {
      URL.revokeObjectURL(url);
    }, ["sink:URL.revokeObjectURL"]);

    addNotification('Data matrix exported successfully', 'success');
  };

  const handleClearData = useCallback(() => {
    const msg = 'CRITICAL: This will incinerate all local data (profile, workouts, nutrition, analytics). This action is irreversible. Proceed?';
    if (window.confirm(msg)) {
      if (clearAllData()) {
        addNotification('System purge complete', 'info');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  }, [clearAllData, addNotification]);

  const labelStyle = "block text-[0.65rem] font-mono font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-voro-primary transition-colors cursor-pointer mb-1";

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] p-4 md:p-8 selection:bg-voro-primary/30">
      <div className="max-w-4xl mx-auto py-12">
        <header className="mb-12 space-y-2">
           <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            System <span className="text-voro-primary not-italic font-bold">Configuration</span>
          </h1>
          <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.3em]">Calibrate neural interface and data bounds</p>
        </header>

        {/* Display Settings */}
        <Card className="p-10 mb-8 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

           <div className="relative z-10">
              <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <SettingsIcon size={16} className="text-voro-primary" />
                Visual Matrix
              </h3>

              <div className="space-y-8">
                <div className="flex items-center justify-between group">
                  <div>
                    <label htmlFor={themeId} className={labelStyle}>Luminous Phase</label>
                    <p className="text-[0.6rem] text-gray-600 uppercase tracking-widest">Toggle dark/light synthesis</p>
                  </div>
                  <button
                    id={themeId}
                    onClick={toggleTheme}
                    className="w-14 h-14 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl hover:border-voro-primary/40 hover:bg-voro-primary/5 transition-all active:scale-90 outline-none"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? (
                      <Moon size={20} className="text-voro-primary" />
                    ) : (
                      <Sun size={20} className="text-voro-accent" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <label htmlFor={fontSizeId} className={labelStyle}>Typography Scale</label>
                    <p className="text-[0.6rem] text-gray-600 uppercase tracking-widest">Adjust interface magnitude</p>
                  </div>
                  <Select
                    id={fontSizeId}
                    value={settings.fontSize || 'medium'}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    options={[
                      { value: 'small', label: 'Compact' },
                      { value: 'medium', label: 'Standard' },
                      { value: 'large', label: 'Expanded' },
                    ]}
                    className="w-48"
                  />
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <label htmlFor={accentColorId} className={labelStyle}>Neural Tint</label>
                    <p className="text-[0.6rem] text-gray-600 uppercase tracking-widest">Select primary brand hue</p>
                  </div>
                  <Select
                    id={accentColorId}
                    value={settings.accentColor || 'voro-primary'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    options={[
                      { value: 'voro-primary', label: 'Violet Spectrum' },
                      { value: 'voro-secondary', label: 'Emerald Flux' },
                      { value: 'voro-accent', label: 'Amber Kinetic' },
                    ]}
                    className="w-48"
                  />
                </div>
              </div>
           </div>
        </Card>

        {/* Unit Settings */}
        <Card className="p-10 mb-8 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl">
           <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em] mb-10">Biometric Standards</h3>
           <div className="space-y-8">
            <div className="flex items-center justify-between group">
               <div>
                <label htmlFor={weightUnitId} className={labelStyle}>Mass Unit</label>
               </div>
              <Select
                id={weightUnitId}
                value={settings.weightUnit || 'kg'}
                onChange={(e) => handleSettingChange('weightUnit', e.target.value)}
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lbs', label: 'Pounds (lbs)' },
                ]}
                className="w-48"
              />
            </div>
            <div className="flex items-center justify-between group">
              <div>
                <label htmlFor={heightUnitId} className={labelStyle}>Verticality Unit</label>
              </div>
              <Select
                id={heightUnitId}
                value={settings.heightUnit || 'cm'}
                onChange={(e) => handleSettingChange('heightUnit', e.target.value)}
                options={[
                  { value: 'cm', label: 'Centimeters (cm)' },
                  { value: 'ft', label: 'Feet (ft)' },
                ]}
                className="w-48"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-10 mb-8 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-xl">
          <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em] mb-10">Neural Alerts</h3>
          <div className="space-y-8">
            <Toggle
              label="Metabolic Reminders"
              enabled={settings.mealReminders !== false}
              onChange={(val) => handleSettingChange('mealReminders', val)}
            />
            <Toggle
              label="Kinetic Prompts"
              enabled={settings.workoutReminders !== false}
              onChange={(val) => handleSettingChange('workoutReminders', val)}
            />
            <Toggle
              label="Hydration Alerts"
              enabled={settings.waterReminders !== false}
              onChange={(val) => handleSettingChange('waterReminders', val)}
            />
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-10 bg-[#0A0C14] border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <h3 className="text-[0.7rem] font-black text-white uppercase tracking-[0.4em] mb-10">Data Logistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-3 !rounded-2xl py-6 border-white/5 hover:bg-white/5"
              onClick={handleExportData}
            >
              <Download size={18} />
              <span className="text-[0.65rem] font-black uppercase tracking-widest">Export Archive</span>
            </Button>
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-3 !rounded-2xl py-6 border-white/5 hover:bg-white/5"
            >
              <Upload size={18} />
              <span className="text-[0.65rem] font-black uppercase tracking-widest">Import Matrix</span>
            </Button>
            <Button
              variant="danger"
              className="sm:col-span-2 flex items-center justify-center gap-3 !rounded-2xl py-6 mt-4 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
              onClick={handleClearData}
            >
              <RotateCcw size={18} />
              <span className="text-[0.65rem] font-black uppercase tracking-widest">Incinerate All Data</span>
            </Button>
          </div>
        </Card>

        {/* About */}
        <div className="mt-16 text-center space-y-2 opacity-30">
          <p className="text-[0.6rem] font-mono font-black text-gray-500 uppercase tracking-[0.5em]">VORO_EVOLUTION_OS // v1.0.0</p>
          <p className="text-[0.5rem] font-mono text-gray-600 uppercase tracking-widest">Local Sequestration Active</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
