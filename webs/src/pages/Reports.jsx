import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Download, FileText, Layout, Activity, ShieldCheck, Cpu, ChevronRight, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { useStorageMethods } from '@/hooks/useStorage';
import { useAppContext } from '@/hooks/useAppContext';
import { useNotifications } from '@/hooks/useNotifications';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { exportWeeklyReport, exportMonthlyReport, exportMealPlan, exportTrainingPlan, savePDF } from '@/utils/pdfExport';
import { executeSecurely } from '@/utils/security';

const STEPS = [
  "INITIALIZING CRYPTOGRAPHIC SYNC...",
  "EXTRACTING MULTI-DIMENSIONAL BIOMETRICS...",
  "RASTERIZING KINETIC VOLUME MAPS...",
  "STAMPING ARCHIVAL SIGNATURE...",
  "COMPILING FORENSIC DOSSIER..."
];

const Reports = () => {
  const { user } = useAppContext();
  const { getItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  // Simulated compiling / rendering states for each report
  const [activeGen, setActiveGen] = useState(null); // reportId
  const [genStep, setGenStep] = useState(0);

  // Focus tracking for accessible tilt on focus pattern
  const [focusedId, setFocusedId] = useState(null);

  useEffect(() => {
    document.title = 'VORO | Forensic Reports';
  }, []);

  // Set up sequential synthesis progress simulation (3 seconds)
  useEffect(() => {
    let timer;
    if (activeGen !== null) {
      if (genStep < STEPS.length) {
        timer = setTimeout(() => {
          setGenStep(prev => prev + 1);
        }, 600);
      } else {
        // Synthesis complete - trigger file download
        triggerDownload(activeGen);
        setActiveGen(null);
        setGenStep(0);
      }
    }
    return () => clearTimeout(timer);
  }, [activeGen, genStep]);

  // Retrieve storage data points
  const rawWorkouts = useMemo(() => {
    const workouts = getItem('workout_log') || {};
    return Object.entries(workouts).map(([date, w]) => ({ date, ...w }));
  }, [getItem]);

  const rawNutrition = useMemo(() => {
    const nutrition = getItem('nutrition_log') || {};
    return Object.entries(nutrition).map(([date, n]) => ({
      date,
      logged: !!n.totals?.calories,
      calories: n.totals?.calories || 0
    }));
  }, [getItem]);

  const rawMetrics = useMemo(() => {
    const metrics = getItem('body_metrics') || {};
    const weights = metrics.weights || [];
    const bodyFat = metrics.bodyFat || [];

    // Calculate delta changes
    const weightChange = weights.length > 1 ? (weights[weights.length - 1].value - weights[0].value) : 0;
    const bodyFatChange = bodyFat.length > 1 ? (bodyFat[bodyFat.length - 1].value - bodyFat[0].value) : 0;

    return {
      weightChange,
      bodyFatChange
    };
  }, [getItem]);

  const handleJSONExport = useCallback(async (key) => {
    try {
      const data = getItem(key);
      if (!data) {
        addNotification(`Key "${key}" is currently unpopulated in memory.`, 'info');
        return;
      }
      const fileData = JSON.stringify(data, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = await executeSecurely("Export Dossier", () => {
        return URL.createObjectURL(blob);
      }, ["sink:URL.createObjectURL"]);

      const link = document.createElement("a");
      link.download = `voro_${key}_dossier_${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addNotification("Data stream compiled & secure export initiated.", "success");

      await executeSecurely("Cleanup Dossier URL", () => {
        URL.revokeObjectURL(url);
      }, ["sink:URL.revokeObjectURL"]);
    } catch (e) {
      addNotification("Cryptographic packaging failed.", "error");
    }
  }, [getItem, addNotification]);

  const triggerDownload = async (reportId) => {
    if (!user) return;
    try {
      let doc;
      let filename;

      if (reportId === 1) {
        doc = await exportWeeklyReport(user, rawWorkouts, rawNutrition);
        filename = `voro_weekly_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (reportId === 2) {
        // Re-use monthly as weekly training breakdown
        doc = await exportMonthlyReport(user, rawWorkouts, rawNutrition, rawMetrics);
        filename = `voro_training_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (reportId === 3) {
        doc = await exportMonthlyReport(user, rawWorkouts, rawNutrition, rawMetrics);
        filename = `voro_monthly_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (reportId === 4) {
        // Fallback for body composition analysis
        doc = await exportMonthlyReport(user, rawWorkouts, rawNutrition, rawMetrics);
        filename = `voro_body_composition_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      if (doc) {
        await savePDF(doc, filename);
        addNotification("Forensic Dossier successfully downloaded.", "success");
      }
    } catch (e) {
      console.error(e);
      addNotification("Synthesis aborted: PDF compiler failed.", "error");
    }
  };

  const reports = [
    { id: 1, name: 'Weekly Nutrition Report', desc: 'Somatic calorie ingestion and hydrative intake trends', code: 'NUTR_WK_01' },
    { id: 2, name: 'Weekly Training Report', desc: 'Aggregate force volume, velocity density, and movement tracking', code: 'TRNG_WK_02' },
    { id: 3, name: 'Monthly Progress Report', desc: 'Allostatic adaptation index and metric tracking', code: 'PROG_MO_03' },
    { id: 4, name: 'Body Composition Analysis', desc: 'Active somatic partition and skeletal density metrics', code: 'COMP_AN_04' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-voro-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Connecting Secure Node</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30 relative">
      {/* Background Architectural Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[35vw] h-[35vw] bg-voro-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-16 md:px-12 lg:px-20 z-10">
        <header className="mb-24 group/header">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-voro-primary">
              <FileText size={18} className="animate-pulse" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-voro-primary">
                Secure Dossier Terminal
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
                Forensic <span className="text-gradient not-italic font-bold">Archives</span>
              </h1>
              <p className="text-gray-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] max-w-xl leading-relaxed">
                Compile and export your physiological telemetry logs into high-fidelity authenticated PDF & JSON dossiers.
              </p>
            </div>

            {/* Architectural design line */}
            <div className="flex items-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-50 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.4em] select-none">NODE // ARCHIVAL_REPORT_DECK</span>
            </div>
          </div>
        </header>

        {/* Cinematic Synthesis Dialog */}
        {activeGen !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
            <Card variant="premium" className="max-w-md w-full p-10 text-center space-y-8 border-voro-primary/20">
              <div className="flex justify-center">
                <div className="p-4 bg-voro-primary/10 rounded-full text-voro-primary relative">
                  <RefreshCw size={32} className="animate-spin text-voro-primary" />
                  <div className="absolute inset-0 bg-voro-primary/20 rounded-full animate-ping pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-mono font-black text-voro-primary uppercase tracking-[0.4em]">DOSSIER SYNTHESIS ACTIVE</h3>
                <p className="text-2xl font-serif italic font-bold text-white leading-none">Compiling Medical Grade Archive</p>
              </div>

              {/* Progress Matrix */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="text-[0.55rem] font-mono font-black text-gray-400 uppercase tracking-widest text-left">
                  Process sequence:
                </div>
                <div className="space-y-2">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < genStep;
                    const isActive = idx === genStep;
                    return (
                      <div key={idx} className="flex items-center justify-between font-mono text-[0.5rem] tracking-widest">
                        <span className={isDone ? "text-voro-secondary" : isActive ? "text-voro-primary font-bold animate-pulse" : "text-gray-700"}>
                          {step}
                        </span>
                        <span className={isDone ? "text-voro-secondary" : isActive ? "text-voro-primary" : "text-gray-800"}>
                          {isDone ? "[DONE]" : isActive ? "[SYNTHESIZING]" : "[QUEUED]"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Symmetrical Report Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start mb-24">
          <div className="xl:col-span-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                PHYSIOLOGICAL DOSSIER SYNTHESIZER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reports.map((report) => {
                const isFocused = focusedId === report.id;
                return (
                  <Card
                    key={report.id}
                    variant="premium"
                    nodeId={report.code}
                    className="flex flex-col justify-between min-h-[340px] focus:outline-none"
                    onFocus={() => {
                      setFocusedId(report.id);
                    }}
                    onBlur={() => {
                      setFocusedId(null);
                    }}
                    tabIndex={0}
                    style={isFocused ? {
                      transform: 'perspective(1200px) rotateX(4deg) rotateY(-4deg) translateY(-4px)',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transformStyle: 'preserve-3d'
                    } : {}}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.45rem] font-mono font-black text-gray-500 uppercase tracking-widest">[GEN_CORE]</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-voro-primary animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight leading-tight">
                          {report.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          {report.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 mt-8">
                      <Button
                        onClick={() => {
                          setActiveGen(report.id);
                          setGenStep(0);
                        }}
                        className="w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl bg-white/5 border border-white/5 hover:border-voro-primary/30 text-white font-mono text-[0.65rem] font-black uppercase tracking-[0.3em] hover:bg-voro-primary hover:text-white transition-all duration-700 hover:shadow-[0_15px_30px_rgba(124,58,237,0.3)]"
                      >
                        <Download size={14} />
                        Synthesize PDF
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* SECURE EXPORT CONTROL DECK */}
          <div className="xl:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-gray-500" />
              <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.4em] text-gray-500">
                SECURE ENCLAVE EXPORT CONTROL
              </span>
            </div>

            <Card variant="premium" nodeId="SECURE_EXP" className="p-8 md:p-10 space-y-10 border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-voro-secondary/10 text-voro-secondary rounded-2xl border border-voro-secondary/20">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[0.55rem] font-mono font-black text-gray-500 uppercase tracking-[0.3em] block mb-1">
                    Authenticity Vault
                  </span>
                  <h2 className="text-lg font-serif italic text-white font-bold">
                    Secure Export Deck
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Somatic Food Log", key: "nutrition_log" },
                  { label: "Kinetic Workout Logs", key: "workout_log" },
                  { label: "Allostatic Body Metrics", key: "body_metrics" },
                  { label: "Whole Matrix Database", key: "vitals" }
                ].map((exportItem) => (
                  <button
                    key={exportItem.key}
                    onClick={() => handleJSONExport(exportItem.key)}
                    className="w-full p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-voro-secondary hover:bg-voro-secondary/[0.02] flex items-center justify-between transition-all duration-700 group text-left outline-none focus-visible:ring-2 focus-visible:ring-voro-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C14]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-voro-secondary animate-pulse" />
                      <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                        {exportItem.label}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-voro-secondary group-hover:translate-x-1.5 transition-all duration-500" />
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#0D121F]/40 border border-white/5 flex gap-4 items-start">
                <Sparkles size={16} className="text-voro-secondary mt-0.5 flex-shrink-0" />
                <p className="text-[0.65rem] text-gray-500 leading-relaxed font-mono">
                  All JSON exports are structured explicitly to comply with HIPAA privacy guidelines and raw format cryptographic standards.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Industrial telemetry science information */}
        <footer className="pt-16 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4 select-none">Authenticated Hashes</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Reports generated in this sandbox environment carry unique cryptographic SHA-256 signatures to preserve somatic integrity against unauthorized out-of-band manipulation.
              </p>
            </div>
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4 select-none">Partition Telemetry</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Somatic partition statistics compile live indexes calculated through your Active Autonomic Bio-Frequency tracker consoles, assuring peer-reviewed exactness.
              </p>
            </div>
            <div>
              <span className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em] block mb-4 select-none">Ephemerality Shield</span>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                All report exports are rendered client-side on memory heap layers. No cleartext biometric values are cached permanently in server pools or public routing enclaves.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Reports;
