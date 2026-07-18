import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Camera, Trash2, X, Layers, Maximize2 } from 'lucide-react';
import { Button } from '@/components/Button';
import Badge from '@/components/Badge';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters.
 */
const progressDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric'
});

/**
 * 🛰️ SPECTRAL LENS COMPONENT
 * A high-fidelity image comparison tool.
 */
const SpectralLens = ({ before, after, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    if (x === undefined) return;

    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  }, []);

  const daysDiff = useMemo(() => {
    const start = new Date(before.date);
    const end = new Date(after.date);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }, [before.date, after.date]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden bg-[#0A0C14] border border-white/5 shadow-2xl group/lens">
      <img src={after.src} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-8 right-12 z-10">
         <div className="flex flex-col items-end">
            <span className="text-[0.5rem] font-mono text-white/40 uppercase tracking-[0.4em]">Spectrum_B // After</span>
            <span className="text-xl font-serif italic text-white">{shortDateFormatter.format(new Date(after.date))}</span>
         </div>
      </div>

      <div
        className="absolute inset-0 z-20 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before.src} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-8 left-12">
          <div className="flex flex-col">
            <span className="text-[0.5rem] font-mono text-voro-primary uppercase tracking-[0.4em]">Spectrum_A // Before</span>
            <span className="text-xl font-serif italic text-white">{shortDateFormatter.format(new Date(before.date))}</span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 z-30 w-px bg-white/20 cursor-ew-resize group-hover/lens:bg-voro-primary transition-colors duration-500"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={(e) => {
          const up = () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', handleMove);
          window.addEventListener('mouseup', up);
        }}
        onTouchMove={handleMove}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center shadow-2xl group-hover/lens:scale-110 group-hover/lens:border-voro-primary transition-all duration-500">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-white/40 rounded-full" />
            <div className="w-0.5 h-4 bg-white/40 rounded-full" />
          </div>
          <div className="absolute inset-[-10px] rounded-full bg-voro-primary/10 animate-pulse-slow blur-xl opacity-0 group-hover/lens:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="absolute top-10 left-10 z-40 flex items-center gap-6 pointer-events-none">
        <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 flex flex-col">
          <span className="text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.4em]">Temporal_Delta</span>
          <span className="text-lg font-serif italic text-white">+{daysDiff} Days</span>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 flex flex-col">
          <span className="text-[0.4rem] font-mono text-gray-500 uppercase tracking-[0.4em]">Signal_Match</span>
          <span className="text-lg font-serif italic text-voro-secondary">94.2%</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-10 right-10 z-40 p-4 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 text-white/40 hover:text-white transition-all"
        aria-label="Close Comparison"
      >
        <X size={18} />
      </button>

      <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none z-50" />
    </div>
  );
};

/**
 * 🛰️ KINETIC PHOTO NODE
 */
const KineticPhotoNode = ({ photo, isSelected, onClick, onDelete, isStart, isLatest }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltY = ((x / rect.width) - 0.5) * 15;
    const tiltX = (0.5 - (y / rect.height)) * 15;
    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const nodeId = useMemo(() => `0x${photo.id.slice(-4).toUpperCase()}`, [photo.id]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--tilt-x', '0deg');
          containerRef.current.style.setProperty('--tilt-y', '0deg');
        }
      }}
      onClick={onClick}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-4px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 0.5s var(--ease-expo-out)',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative group rounded-[2rem] overflow-hidden cursor-pointer border transition-all duration-500
        ${isSelected ? 'border-voro-primary shadow-[0_20px_40px_rgba(124,58,237,0.2)]' : 'border-white/5 shadow-xl hover:border-white/10'}
      `}
    >
      <div className="aspect-[4/5] relative">
        <img src={photo.src} alt={photo.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="font-mono text-[0.45rem] font-black text-white/40 tracking-[0.2em] bg-black/40 backdrop-blur-xl px-2 py-1 rounded-md border border-white/10">
            {nodeId}
          </div>
        </div>
        <div className="absolute bottom-6 left-8 right-8 z-10">
          <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.4em] mb-1">Log_Sequence</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-serif italic text-white tracking-tight">
              {progressDateFormatter.format(new Date(photo.date))}
            </span>
            {isSelected && (
               <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.8)] animate-pulse" />
            )}
          </div>
        </div>
        <div className="absolute top-6 left-6 flex gap-2">
          {isStart && <Badge variant="voro-primary" className="text-[0.5rem] tracking-[0.2em]">APEX_START</Badge>}
          {isLatest && <Badge variant="voro-secondary" className="text-[0.5rem] tracking-[0.2em]">LATEST_SYNC</Badge>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
          className="absolute top-6 right-6 p-3 rounded-xl bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const ProgressPhotos = () => {
  const photos = useStorageKey('voro_progress_photos') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Spectral Progress Matrix';
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        setCompareMode(prev => !prev);
        setCompareA(null); setCompareB(null);
      }
      if (e.key.toLowerCase() === 'u' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        fileRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => {
      /* ⚡ PERFORMANCE OPTIMIZATION: Raw Relational Sort Optimization.
         Utilizes raw string relational comparison to avoid both dynamic Date
         allocation and localeCompare engine overhead. Safe-guarded with falls. */
      const dA = a.date || '';
      const dB = b.date || '';
      return dA < dB ? -1 : dA > dB ? 1 : 0;
    });
  }, [photos]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Security: Validate file size (max 5MB to prevent LocalStorage exhaustion / Denial of Service)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      addNotification('File exceeds safety size limit of 5MB.', 'error');
      return;
    }

    // Security: Validate file type against strict whitelist of safe image MIME types
    const SAFE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!SAFE_IMAGE_TYPES.includes(file.type)) {
      addNotification('Invalid file type. Only secure image profiles (JPEG, PNG, WEBP, GIF) are accepted.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        id: `photo-${Date.now()}`,
        src: reader.result,
        date: new Date().toISOString(),
        label: `Photo ${photos.length + 1}`
      };
      setItem('voro_progress_photos', [...photos, newPhoto]);
      addNotification('Biometric visual record synthesized.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id) => {
    setItem('voro_progress_photos', photos.filter(p => p.id !== id));
    if (compareA?.id === id) setCompareA(null);
    if (compareB?.id === id) setCompareB(null);
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
    addNotification('Visual record decommissioned.', 'info');
  };

  const daysTracked = useMemo(() => {
    if (sortedPhotos.length < 2) return 0;
    const start = new Date(sortedPhotos[0].date);
    const end = new Date(sortedPhotos[sortedPhotos.length - 1].date);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }, [sortedPhotos]);

  return (
    <div className="min-h-screen bg-transparent text-[#F0F4FF] selection:bg-voro-primary/30">
      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Breadcrumb
          items={[{ label: 'System', href: '/dashboard' }, { label: 'Neural Matrix', href: '/dashboard' }, { label: 'Progress Photos' }]}
          className="mb-12"
        />

        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-16">
          <div className="space-y-10 max-w-4xl">
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em] opacity-90">Visual Biometric Archive // SYSTEM_ACTIVE</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[5rem] md:text-[8.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.85] mb-4">Spectral,</h1>
              <div className="flex flex-col md:flex-row md:items-end gap-12">
                <span className="text-gradient text-[5.5rem] md:text-[9rem] font-serif font-black tracking-[-0.05em] leading-[0.8]">Evolution.</span>
                <div className="grid grid-cols-2 gap-10 pb-4 border-l border-white/5 pl-10 ml-2">
                   <div className="space-y-2">
                    <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.5em] block">Archived</span>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-voro-primary" />
                      <span className="text-[0.7rem] font-mono text-white font-bold tracking-[0.2em]">{photos.length} NODES</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-[0.5em] block">Timeline</span>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary" />
                      <span className="text-[0.7rem] font-mono text-white font-bold tracking-[0.2em]">{daysTracked} DAYS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pb-2">
            <Button variant={compareMode ? "primary" : "secondary"} onClick={() => { setCompareMode(!compareMode); setCompareA(null); setCompareB(null); }} shortcut="C" className="!rounded-full px-10">
              <Layers size={18} />
              <span>{compareMode ? "Exit Analysis" : "Spectral Lens"}</span>
            </Button>
            <Button onClick={() => fileRef.current?.click()} shortcut="U" className="!bg-white !text-black !rounded-full shadow-2xl shadow-white/10 px-10">
              <Camera size={18} />
              <span>Upload Record</span>
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </header>

        {compareMode && (
          <section className="mb-20 animate-scale-in">
            {compareA && compareB ? (
               <SpectralLens before={compareA} after={compareB} onClose={() => { setCompareA(null); setCompareB(null); }} />
            ) : (
              <div className="relative p-20 rounded-[3rem] bg-[#0A0C14] border border-dashed border-voro-primary/30 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-full bg-voro-primary/5 border border-voro-primary/20 flex items-center justify-center mb-8 animate-pulse">
                    <Maximize2 size={32} className="text-voro-primary" />
                 </div>
                 <h3 className="text-3xl font-serif italic font-medium text-white mb-4">Select Two Temporal Nodes</h3>
                 <div className="mt-12 flex gap-8">
                    <div className={`px-6 py-3 rounded-xl border font-mono text-[0.6rem] tracking-widest ${compareA ? 'bg-voro-primary/10 border-voro-primary text-voro-primary' : 'bg-white/5 border-white/5 text-gray-700'}`}>[NODE_A: {compareA ? 'READY' : 'EMPTY'}]</div>
                    <div className={`px-6 py-3 rounded-xl border font-mono text-[0.6rem] tracking-widest ${compareB ? 'bg-voro-primary/10 border-voro-primary text-voro-primary' : 'bg-white/5 border-white/5 text-gray-700'}`}>[NODE_B: {compareB ? 'READY' : 'EMPTY'}]</div>
                 </div>
              </div>
            )}
          </section>
        )}

        {photos.length === 0 ? (
          <div className="py-48 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-12">
               <div className="absolute inset-0 bg-voro-primary/20 rounded-full blur-[40px] animate-pulse" />
               <div className="relative w-full h-full rounded-full bg-[#0A0C14] border border-white/10 flex items-center justify-center">
                  <Camera size={48} className="text-voro-primary" />
               </div>
            </div>
            <h3 className="text-4xl font-serif italic font-medium text-white mb-6">Archive Empty</h3>
            <Button onClick={() => fileRef.current?.click()} className="mt-12 !rounded-full px-12">Initialize Baseline</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedPhotos.map((photo, idx) => (
              <KineticPhotoNode
                key={photo.id}
                photo={photo}
                isSelected={compareA?.id === photo.id || compareB?.id === photo.id}
                isStart={idx === 0}
                isLatest={idx === sortedPhotos.length - 1 && idx > 0}
                onDelete={deletePhoto}
                onClick={() => {
                  if (compareMode) {
                    if (!compareA) setCompareA(photo);
                    else if (!compareB && compareA.id !== photo.id) setCompareB(photo);
                    else if (compareA.id === photo.id) setCompareA(null);
                    else if (compareB.id === photo.id) setCompareB(null);
                  } else {
                    setSelectedPhoto(photo);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title="Visual Examination">
        {selectedPhoto && (
          <div className="space-y-8">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <img src={selectedPhoto.src} alt="Examination" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.03] pointer-events-none" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-[0.4em] mb-1">Temporal_Stamp</p>
                <p className="text-2xl font-serif italic font-medium text-white">{progressDateFormatter.format(new Date(selectedPhoto.date))}</p>
              </div>
              <Button variant="danger" onClick={() => deletePhoto(selectedPhoto.id)} className="!rounded-xl">Decommission Node</Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="fixed inset-0 bg-boutique-grain opacity-[0.015] pointer-events-none z-[100]" />
    </div>
  );
};

export default ProgressPhotos;
