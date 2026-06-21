import React, { useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Progress from '@/components/Progress';
import Header from '@/components/Header';

const Dashboard2 = () => {
  useEffect(() => {
    document.title = 'VORO | Alternative Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Header
          eyebrow="System_Analysis_v2.0"
          title={<>Alternative <span className="text-voro-primary not-italic font-bold">Insights</span></>}
          subtitle="A high-fidelity perspective on your current biological trajectory and system telemetry."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 group hover:border-voro-info/30 transition-all duration-700" variant="glass">
             <div className="flex items-center justify-between mb-8">
               <div className="p-4 bg-voro-info/10 rounded-2xl text-voro-info shadow-lg shadow-voro-info/20">
                 <span className="text-2xl">📊</span>
               </div>
               <span className="text-[0.6rem] font-mono font-bold text-voro-info uppercase tracking-[0.4em]">Matrix_01</span>
             </div>
             <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Nutrition Summary</p>
             <div className="flex items-baseline gap-3">
               <span className="text-4xl font-serif italic font-bold text-white">1,850</span>
               <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">kcal logged</span>
             </div>
             <div className="mt-8 pt-8 border-t border-white/5">
                <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.2em]">Target Ceiling: 2,200 kcal</span>
             </div>
          </Card>

          <Card className="p-8 group hover:border-voro-secondary/30 transition-all duration-700" variant="glass">
             <div className="flex items-center justify-between mb-8">
               <div className="p-4 bg-voro-secondary/10 rounded-2xl text-voro-secondary shadow-lg shadow-voro-secondary/20">
                 <span className="text-2xl">💪</span>
               </div>
               <span className="text-[0.6rem] font-mono font-bold text-voro-secondary uppercase tracking-[0.4em]">Matrix_02</span>
             </div>
             <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Active Session</p>
             <div className="flex items-baseline gap-3">
               <span className="text-4xl font-serif italic font-bold text-white">45</span>
               <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">Min Depth</span>
             </div>
             <div className="mt-8 pt-8 border-t border-white/5">
                <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.2em]">Archetype: Upper Body Push</span>
             </div>
          </Card>

          <Card className="p-8 group hover:border-voro-primary/30 transition-all duration-700" variant="glass">
             <div className="flex items-center justify-between mb-8">
               <div className="p-4 bg-voro-primary/10 rounded-2xl text-voro-primary shadow-lg shadow-voro-primary/20">
                 <span className="text-2xl">📈</span>
               </div>
               <span className="text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.4em]">Matrix_03</span>
             </div>
             <p className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Kinetic Shift</p>
             <div className="flex items-baseline gap-3">
               <span className="text-4xl font-serif italic font-bold text-white">↓ 2.5</span>
               <span className="text-[0.65rem] font-mono text-gray-600 uppercase tracking-widest">kg Mass</span>
             </div>
             <div className="mt-8 pt-8 border-t border-white/5">
                <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.2em]">Temporal Frame: 30D Matrix</span>
             </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
              <h3 className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-white">Express Commands</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button variant="secondary" className="w-full !justify-start !px-8 h-16 group/btn">
                <span className="text-gray-500 group-hover/btn:text-voro-primary transition-colors mr-4 font-mono text-xs">01</span>
                Log Nutritional Intake
              </Button>
              <Button variant="secondary" className="w-full !justify-start !px-8 h-16 group/btn">
                <span className="text-gray-500 group-hover/btn:text-voro-primary transition-colors mr-4 font-mono text-xs">02</span>
                Archive Movement Pattern
              </Button>
              <Button variant="secondary" className="w-full !justify-start !px-8 h-16 group/btn">
                <span className="text-gray-500 group-hover/btn:text-voro-primary transition-colors mr-4 font-mono text-xs">03</span>
                Examine Biometric Logs
              </Button>
            </div>
          </Card>

          <Card className="p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h3 className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-white">Temporal Goals</h3>
            </div>
            <div className="space-y-10">
              <Progress
                label="Energy Balance"
                value={1850}
                max={2200}
                color="info"
              />
              <Progress
                label="Protein Density"
                value={148}
                max={160}
                color="secondary"
              />
              <Progress
                label="Hydration Matrix"
                value={1300}
                max={2000}
                color="info"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
