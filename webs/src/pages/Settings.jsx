import React, { useEffect, useState } from 'react';
import { Moon, Sun, Settings as SettingsIcon, RotateCcw, Download, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Toggle from '@/components/Toggle';
import { useStorage } from '@/hooks/useStorage';
import { useApp } from '@/hooks/useAppContext';

const Settings = () => {
  const { getStorage, setStorage, exportData, clearAllData } = useStorage();
  const { user } = useApp();
  const [settings, setSettings] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.title = 'VORO | Settings';
    const savedSettings = getStorage('voro_settings') || {};
    setSettings(savedSettings);
    setTheme(savedSettings.theme || 'dark');
  }, []);

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setStorage('voro_settings', updated);
    setSettings(updated);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
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

  if (!settings) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] overflow-x-hidden p-8 lg:p-24">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">System Parameters</span>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>
            <h1 className="text-7xl font-black font-serif italic text-white leading-[0.9] tracking-tighter">
              Control <span className="text-gradient not-italic">Interface</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Display & Metrics */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <h3 className="text-[10px] font-mono font-bold text-voro-primary uppercase tracking-[0.4em]">Environmental Aesthetics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Visual Polarity</p>
                    <p className="text-xl font-serif italic text-white mb-6">Dark Mode / Matrix</p>
                  </div>
                  <button onClick={toggleTheme} className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest text-voro-primary">
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    Switch Polarity
                  </button>
                </Card>

                <Card className="flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Biological Accents</p>
                    <p className="text-xl font-serif italic text-white mb-6">Primary Spectrum</p>
                  </div>
                  <select
                    value={settings.accentColor || 'voro-primary'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="bg-transparent border-b border-white/10 text-xs font-mono uppercase tracking-widest text-voro-primary focus:outline-none"
                  >
                    <option value="voro-primary">Violet // Neural</option>
                    <option value="voro-secondary">Emerald // Kinetic</option>
                    <option value="voro-accent">Amber // Thermal</option>
                  </select>
                </Card>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em]">Metric Standards</h3>
              <Card className="space-y-8">
                <div className="flex items-center justify-between pb-8 border-b border-white/5">
                  <div>
                    <p className="text-lg font-serif italic text-white">Mass Quantifier</p>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Weight Unit Selection</p>
                  </div>
                  <select
                    value={settings.weightUnit || 'kg'}
                    onChange={(e) => handleSettingChange('weightUnit', e.target.value)}
                    className="bg-transparent border-b border-white/10 text-xs font-mono font-bold uppercase tracking-widest text-white focus:outline-none"
                  >
                    <option value="kg">KILOGRAMS (KG)</option>
                    <option value="lbs">POUNDS (LBS)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-serif italic text-white">Vertical Stature</p>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Height Unit Selection</p>
                  </div>
                  <select
                    value={settings.heightUnit || 'cm'}
                    onChange={(e) => handleSettingChange('heightUnit', e.target.value)}
                    className="bg-transparent border-b border-white/10 text-xs font-mono font-bold uppercase tracking-widest text-white focus:outline-none"
                  >
                    <option value="cm">CENTIMETERS (CM)</option>
                    <option value="ft">FEET (FT)</option>
                  </select>
                </div>
              </Card>
            </section>
          </div>

          {/* Side Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
             <section className="space-y-8">
                <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.4em]">Neural Notifications</h3>
                <Card className="space-y-6">
                  <Toggle label="MEAL REMINDERS" enabled={settings.mealReminders !== false} onChange={(val) => handleSettingChange('mealReminders', val)} />
                  <Toggle label="KINETIC REMINDERS" enabled={settings.workoutReminders !== false} onChange={(val) => handleSettingChange('workoutReminders', val)} />
                  <Toggle label="SATURATION REMINDERS" enabled={settings.waterReminders !== false} onChange={(val) => handleSettingChange('waterReminders', val)} />
                </Card>
             </section>

             <section className="space-y-8">
                <h3 className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-[0.4em]">Entropy Control</h3>
                <Card className="space-y-4">
                  <Button variant="secondary" fullWidth onClick={handleExportData} className="flex items-center gap-4">
                    <Download size={14} /> EXPORT MANIFEST
                  </Button>
                  <Button variant="danger" fullWidth onClick={handleClearData} className="flex items-center gap-4">
                    <RotateCcw size={14} /> PURGE CORE DATA
                  </Button>
                </Card>
             </section>

             <div className="p-10 border border-white/5 text-center">
                <p className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase">VORO OPERATING SYSTEM // V1.0.0</p>
                <p className="text-[8px] font-mono text-gray-800 uppercase mt-4">Local Encryption Active</p>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #7C3AED, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Settings;
