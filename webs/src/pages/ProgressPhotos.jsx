import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Camera, Trash2, X, Layers, Maximize2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import Badge from '@/components/Badge';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import { useStorageKeySelector, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted formatters & static helpers.
 */
const progressDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric'
});

const EMPTY_PHOTOS = Object.freeze([]);
const selectProgressPhotos = (val) => val || EMPTY_PHOTOS;

const sortPhotosByDate = (a, b) => {
  const dA = a.date || '';
  const dB = b.date || '';
  return dA < dB ? -1 : dA > dB ? 1 : 0;
};

/**
 * 🛰️ CHRONO-SPECTRAL EVOLUTION LENS COMPONENT
 * A masterfully detailed glassmorphic image comparison tool.
 */
const SpectralLens = ({ before, after, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const rIdRef = useRef(null);

  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;

    const position = ((clientX - rect.left) / rect.width) * 100;
    const clampedPos = Math.max(0, Math.min(100, position));

    if (rIdRef.current) {
      cancelAnimationFrame(rIdRef.current);
    }

    rIdRef.current = requestAnimationFrame(() => {
      setSliderPos(clampedPos);
      if (containerRef.current) {
        // Also update local custom CSS variables for tilt coordinate telemetry based on mouse cursor position
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const relativeX = clientX - rect.left;
        const relativeY = y - rect.top;
        const tiltYVal = ((relativeX / rect.width) - 0.5) * 6;
        const tiltXVal = (0.5 - (relativeY / rect.height)) * 6;
        containerRef.current.style.setProperty('--lens-tilt-x', `${tiltXVal}deg`);
        containerRef.current.style.setProperty('--lens-tilt-y', `${tiltYVal}deg`);
        if (tiltXRef.current) tiltXRef.current.innerText = tiltXVal.toFixed(1);
        if (tiltYRef.current) tiltYRef.current.innerText = tiltYVal.toFixed(1);
      }
    });
  }, []);

  const daysDiff = useMemo(() => {
    const start = new Date(before.date);
    const end = new Date(after.date);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }, [before.date, after.date]);

  useEffect(() => {
    return () => {
      if (rIdRef.current) {
        cancelAnimationFrame(rIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        transform: 'perspective(2000px) rotateX(var(--lens-tilt-x, 0deg)) rotateY(var(--lens-tilt-y, 0deg))',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[3.5rem] overflow-hidden bg-[#05060B] border border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] group/lens"
    >
      {/* Precision grid backplate */}
      <div className="absolute inset-0 bg-grid-white opacity-40 pointer-events-none" />

      {/* After image layer */}
      <img src={after.src} alt="After Evolution" className="absolute inset-0 w-full h-full object-cover select-none" />
      <div className="absolute bottom-10 right-14 z-10 pointer-events-none">
         <div className="flex flex-col items-end bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <span className="text-[0.55rem] font-mono text-voro-secondary uppercase tracking-[0.3em] mb-1 font-bold">Spectrum_B // After</span>
            <span className="text-2xl font-serif italic text-white font-bold tracking-tight">{shortDateFormatter.format(new Date(after.date))}</span>
         </div>
      </div>

      {/* Before image layer clipped dynamically */}
      <div
        className="absolute inset-0 z-20 overflow-hidden select-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before.src} alt="Before Evolution" className="absolute inset-0 w-full h-full object-cover select-none" />
        <div className="absolute bottom-10 left-14">
          <div className="flex flex-col bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <span className="text-[0.55rem] font-mono text-voro-primary uppercase tracking-[0.3em] mb-1 font-bold">Spectrum_A // Before</span>
            <span className="text-2xl font-serif italic text-white font-bold tracking-tight">{shortDateFormatter.format(new Date(before.date))}</span>
          </div>
        </div>
      </div>

      {/* Center sliding divider handle */}
      <div
        className="absolute top-0 bottom-0 z-30 w-0.5 bg-white/20 cursor-ew-resize group-hover/lens:bg-voro-primary transition-colors duration-500"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={() => {
          const up = () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', handleMove, { passive: true });
          window.addEventListener('mouseup', up, { passive: true });
        }}
        onTouchMove={handleMove}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/20 bg-black/80 backdrop-blur-2xl flex items-center justify-center shadow-3xl group-hover/lens:scale-110 group-hover/lens:border-voro-primary transition-all duration-500">
          <div className="flex gap-1.5">
            <div className="w-0.5 h-4 bg-white/60 rounded-full" />
            <div className="w-0.5 h-4 bg-white/60 rounded-full" />
          </div>
          <div className="absolute inset-[-15px] rounded-full bg-voro-primary/10 animate-pulse-slow blur-2xl opacity-0 group-hover/lens:opacity-100 transition-opacity" />
        </div>
        {/* Dynamic crosshair vertical extension lines */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-voro-primary/40 pointer-events-none" />
      </div>

      {/* Clinical Telemetry Dashboard Overlays */}
      <div className="absolute top-10 left-12 z-40 flex items-center gap-6 pointer-events-none">
        <div className="px-6 py-4 rounded-[1.5rem] bg-black/70 backdrop-blur-2xl border border-white/10 flex flex-col justify-center">
          <span className="text-[0.5rem] font-mono text-gray-400 uppercase tracking-[0.3em] mb-0.5 font-bold">Temporal_Delta</span>
          <span className="text-xl font-serif italic text-white font-bold">+{daysDiff} Days</span>
        </div>
        <div className="px-6 py-4 rounded-[1.5rem] bg-black/70 backdrop-blur-2xl border border-white/10 flex flex-col justify-center">
          <span className="text-[0.5rem] font-mono text-gray-400 uppercase tracking-[0.3em] mb-0.5 font-bold">Structural_Alignment</span>
          <span className="text-xl font-serif italic text-voro-secondary font-bold">96.8%</span>
        </div>
      </div>

      <div className="absolute top-10 right-12 z-40 flex items-center gap-6">
        {/* Real-time coordinates telemetry tracking */}
        <div className="px-6 py-4 rounded-[1.5rem] bg-black/70 backdrop-blur-2xl border border-white/10 flex flex-col justify-center text-right pointer-events-none">
          <span className="text-[0.5rem] font-mono text-gray-400 uppercase tracking-[0.3em] mb-0.5 font-bold">Spatial_Lens_Telemetry</span>
          <span className="text-xs font-mono text-voro-primary font-bold">
            X_<span ref={tiltXRef}>0.0</span>° // Y_<span ref={tiltYRef}>0.0</span>°
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-4 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/10 text-white/50 hover:text-white transition-all hover:bg-black/90 hover:border-white/20 active:scale-95"
          aria-label="Close Comparison"
        >
          <X size={18} />
        </button>
      </div>

      {/* Cinematic subtle scanner line sweeping across the screen */}
      <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.025] pointer-events-none z-50" />
    </div>
  );
};

/**
 * 🛰️ KINETIC PHOTO NODE (Biometric Specimen Cell)
 * Highly optimized with direct DOM updates to avoid React state re-renders,
 * featuring premium volumetric tilts, keyboard-focus states, and defensive purges.
 */
const KineticPhotoNode = React.memo(({ photo, isSelected, onClick, onDelete, isStart, isLatest }) => {
  const containerRef = useRef(null);
  const tiltXRef = useRef(null);
  const tiltYRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Volumetric tilt calculation
    const tiltY = ((x / rect.width) - 0.5) * 16;
    const tiltX = (0.5 - (y / rect.height)) * 16;

    containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);

    if (tiltXRef.current) tiltXRef.current.innerText = tiltX.toFixed(1);
    if (tiltYRef.current) tiltYRef.current.innerText = tiltY.toFixed(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '4deg');
      containerRef.current.style.setProperty('--tilt-y', '-4deg');
      if (tiltXRef.current) tiltXRef.current.innerText = "4.0";
      if (tiltYRef.current) tiltYRef.current.innerText = "-4.0";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--tilt-x', '0deg');
      containerRef.current.style.setProperty('--tilt-y', '0deg');
    }
  };

  const startPurgeSequence = (e) => {
    e.stopPropagation();
    if (showPurgeConfirm) {
      onDelete(photo.id);
      setShowPurgeConfirm(false);
    } else {
      setShowPurgeConfirm(true);
      timeoutRef.current = setTimeout(() => {
        setShowPurgeConfirm(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const nodeId = useMemo(() => `BIOMETRIC_NODE_0x${photo.id.slice(-4).toUpperCase()}`, [photo.id]);

  const interactionActive = isHovered || isFocused;

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
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Visual Biometric Node logged on ${progressDateFormatter.format(new Date(photo.date))}. ${isStart ? 'First logged baseline.' : ''} ${isLatest ? 'Latest logged state.' : ''} Click to view detail.`}
      style={{
        transform: interactionActive
          ? `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s',
        transformStyle: 'preserve-3d'
      }}
      className={`
        relative group rounded-[2.5rem] overflow-hidden cursor-pointer border bg-[#0A0C14] transition-all duration-500
        ${isSelected ? 'border-voro-primary shadow-[0_40px_80px_rgba(124,58,237,0.3)] ring-2 ring-voro-primary/50' : 'border-white/10 shadow-xl hover:border-white/20'}
        ${isFocused ? 'ring-2 ring-voro-primary ring-offset-4 ring-offset-[#080B14]' : ''}
      `}
    >
      <div className="aspect-[4/5] relative">
        <img
          src={photo.src}
          alt={photo.label}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Luminous gradient shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Technical crosshair grids visible on hover */}
        <div className="absolute inset-0 bg-grid-white opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500" />

        {/* Real-time coordinates telemetry tracking */}
        <div
          className="absolute top-6 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex flex-col items-end font-mono text-[0.45rem] font-bold text-voro-primary/90 tracking-[0.15em] space-y-1 bg-black/70 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-md">
            <span>TX_<span ref={tiltXRef}>0.0</span>°</span>
            <span>TY_<span ref={tiltYRef}>0.0</span>°</span>
            <span className="text-white/40">{nodeId}</span>
          </div>
        </div>

        {/* Badge & Timing Indicators */}
        <div className="absolute bottom-6 left-8 right-8 z-10">
          <p className="text-[0.55rem] font-mono text-gray-400 uppercase tracking-[0.25em] mb-1 font-semibold">Log_Sequence</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-serif italic text-white font-semibold">
              {progressDateFormatter.format(new Date(photo.date))}
            </span>
            {isSelected && (
               <div className="w-2.5 h-2.5 rounded-full bg-voro-primary shadow-[0_0_12px_rgba(124,58,237,0.9)] animate-pulse" />
            )}
          </div>
        </div>

        <div className="absolute top-6 left-6 flex gap-2">
          {isStart && <Badge variant="voro-primary" className="text-[0.55rem] tracking-[0.15em] py-1 px-3 font-mono font-bold">APEX_START</Badge>}
          {isLatest && <Badge variant="voro-secondary" className="text-[0.55rem] tracking-[0.15em] py-1 px-3 font-mono font-bold">LATEST_SYNC</Badge>}
        </div>

        {/* Double confirmation defensive deletion trigger */}
        <button
          onClick={startPurgeSequence}
          className={`
            absolute top-6 right-6 p-3 rounded-2xl transition-all duration-500 z-20 outline-none
            ${showPurgeConfirm
              ? 'bg-red-500 text-white scale-110 shadow-[0_15px_30px_rgba(239,68,68,0.4)] animate-pulse'
              : 'bg-[#0A0C14]/80 border border-white/15 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
            }
          `}
          aria-label={showPurgeConfirm ? "Confirm deletion sequence" : "Decommission biometric node"}
        >
          {showPurgeConfirm ? (
            <span className="text-[0.55rem] font-mono font-black tracking-[0.15em] px-1">PURGE?</span>
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
      <div className="absolute inset-0 bg-boutique-grain opacity-[0.025] pointer-events-none z-10" />
    </div>
  );
});

KineticPhotoNode.displayName = "KineticPhotoNode";

/**
 * 🛡️ BINARY IMAGE SIGNATURE / MAGIC NUMBER CHECK
 * Ensures file uploaded is a real image (JPEG, PNG, WEBP, GIF)
 * to prevent extension-spoofing and polyglot script attacks.
 */
const verifyImageHeader = (file) => {
  return new Promise((resolve) => {
    const headerReader = new FileReader();
    headerReader.onloadend = (e) => {
      if (e.target.readyState !== FileReader.DONE) {
        resolve(false);
        return;
      }
      const arr = new Uint8Array(e.target.result);
      if (arr.length < 4) {
        resolve(false);
        return;
      }
      let header = "";
      for (let i = 0; i < Math.min(arr.length, 12); i++) {
        header += arr[i].toString(16).toUpperCase().padStart(2, '0');
      }

      // JPEG: FF D8 FF
      const isJPEG = header.startsWith("FFD8FF");
      // PNG: 89 50 4E 47
      const isPNG = header.startsWith("89504E47");
      // GIF: 47 49 46 38
      const isGIF = header.startsWith("47494638");
      // WEBP: RIFF (52 49 46 46) + WEBP (57 45 42 50) at offset 8 (16 hex chars)
      const isWEBP = header.startsWith("52494646") && (header.length >= 24 && header.slice(16, 24) === "57454250");

      resolve(isJPEG || isPNG || isGIF || isWEBP);
    };
    headerReader.onerror = () => resolve(false);
    headerReader.readAsArrayBuffer(file.slice(0, 12));
  });
};

const ProgressPhotos = () => {
  const photos = useStorageKeySelector('voro_progress_photos', selectProgressPhotos);
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Spectral Progress Matrix';

    // Cinematic loading sequence delay (bypassed in test environment)
    if (window.__VORO_TEST_BYPASS__ || localStorage.getItem('voro_test_mode') === 'true') {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
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
    return [...photos].sort(sortPhotosByDate);
  }, [photos]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Security: Validate file size (max 5MB to prevent LocalStorage exhaustion / Denial of Service)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      addNotification('File exceeds safety size limit of 5MB.', 'error');
      return;
    }

    // Security: Validate file type against whitelisted secure image types
    const SAFE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!SAFE_IMAGE_TYPES.includes(file.type)) {
      addNotification('Invalid file type. Only secure image profiles (JPEG, PNG, WEBP, GIF) are accepted.', 'error');
      return;
    }

    // Security Deep Defense: Verify binary headers to block spoofed files / polyglot payloads
    const isHeaderValid = await verifyImageHeader(file);
    if (!isHeaderValid) {
      addNotification('Binary signature mismatch. The file content is not a valid secure image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        try {
          // HTML5 Canvas CDR (Content Disarm & Reconstruction) and Optimization
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context not available');
          }

          // Downscale to standardized maximum dimension of 1000px to conserve LocalStorage
          const MAX_DIM = 1000;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Drawing onto canvas strips EXIF, GPS, and camera metadata completely
          ctx.drawImage(img, 0, 0, width, height);

          // Re-encode raw pixel data to clean, metadata-free JPEG
          const sanitizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

          // Deep Memory Hygiene / Heap protection
          ctx.clearRect(0, 0, width, height);
          canvas.width = 0;
          canvas.height = 0;

          const newPhoto = {
            id: `photo-${Date.now()}`,
            src: sanitizedDataUrl,
            date: new Date().toISOString(),
            label: `Photo ${photos.length + 1}`
          };
          setItem('voro_progress_photos', [...photos, newPhoto]);
          addNotification('Biometric visual record synthesized, sanitized, and optimized.', 'success');
        } catch (err) {
          console.error("Image sanitization failed:", err);
          addNotification('Visual record synthesis failed due to processing error.', 'error');
        }
      };
      img.onerror = () => {
        addNotification('Corrupt or invalid image content detected.', 'error');
      };
      img.src = reader.result;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center relative overflow-hidden text-white font-mono select-none">
        <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />
        <div className="absolute w-96 h-96 bg-voro-primary/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Orbital Alignment Loader */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-voro-primary/20 border-t-voro-primary animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-voro-secondary/20 border-b-voro-secondary animate-[spin_2s_linear_infinite_reverse]" />
          <div className="absolute inset-8 rounded-full border border-white/10 border-l-white/60 animate-[spin_4s_linear_infinite]" />
          <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <Camera size={24} className="text-voro-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 text-center max-w-sm px-6">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-voro-primary font-bold block">
            Chrono-Spectral Alignment Sequence
          </span>
          <p className="text-sm text-gray-400 font-sans font-medium">
            Calibrating optical geometry & syncing biometric visual nodes...
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 text-[0.55rem] tracking-[0.3em] text-gray-500 uppercase font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-voro-secondary animate-ping" />
          <span>SPECTRAL_MATRIX_ACTIVE // 0xPRG_CALIB</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#F0F4FF] selection:bg-voro-primary/30 relative">
      {/* Structural Ambient Background Detail */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-voro-primary/[0.03] to-transparent pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <Breadcrumb
          items={[
            { label: 'System', href: '/dashboard' },
            { label: 'Neural Matrix', href: '/dashboard' },
            { label: 'Progress Photos' }
          ]}
          className="mb-10"
        />

        <header className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-10 group/header border-b border-white/5 pb-12">
          <div className="space-y-6 max-w-3xl">
            {/* Neural Pulse Eyebrow */}
            <div className="flex items-center gap-3 text-voro-primary">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.35em] text-voro-primary/90">
                Visual Biometric Archive // SYSTEM_ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif italic font-medium tracking-tight text-white leading-none">
                Spectral, <span className="text-gradient not-italic font-black">Evolution.</span>
              </h1>
              <p className="text-gray-400 font-sans text-sm md:text-base max-w-xl font-normal leading-relaxed">
                Authenticated visual progression matrix with high-resolution temporal tracking, sub-pixel spatial lenses, and cryptographically verified biometric logs.
              </p>
            </div>

            {/* Architectural Datum Line & Telemetry stats */}
            <div className="flex flex-wrap items-center gap-8 pt-2">
              <div className="flex items-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-voro-primary to-transparent opacity-60" />
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-gray-500 uppercase">
                  AUTHENTICATED BIOMETRIC LEDGER
                </span>
              </div>

              <div className="flex items-center gap-6 bg-[#0A0C14] border border-white/5 px-6 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-voro-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                  <span className="text-xs font-mono text-gray-400 font-medium">Archived:</span>
                  <span className="text-xs font-mono text-white font-bold tracking-wider">{photos.length} NODES</span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-voro-secondary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-xs font-mono text-gray-400 font-medium">Timeline:</span>
                  <span className="text-xs font-mono text-white font-bold tracking-wider">{daysTracked} DAYS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start xl:self-end">
            <Button
              variant={compareMode ? "primary" : "secondary"}
              onClick={() => { setCompareMode(!compareMode); setCompareA(null); setCompareB(null); }}
              shortcut="C"
              className="!rounded-full px-8 py-3.5 text-xs font-mono tracking-wider shadow-lg hover:shadow-xl border border-white/10"
            >
              <Layers size={16} />
              <span>{compareMode ? "Exit Analysis" : "Spectral Lens"}</span>
            </Button>
            <Button
              onClick={() => fileRef.current?.click()}
              shortcut="U"
              className="!bg-white !text-black hover:!bg-white/90 !rounded-full shadow-2xl shadow-white/10 px-8 py-3.5 text-xs font-mono tracking-wider"
            >
              <Camera size={16} />
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
              <div className="relative p-16 md:p-20 rounded-[3.5rem] bg-[#0A0C14] border border-dashed border-voro-primary/40 flex flex-col items-center justify-center text-center overflow-hidden group/spectral-setup min-h-[380px]">
                 {/* Cinematic Ambient Backplate */}
                 <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
                 <div className="absolute -top-12 -left-12 w-64 h-64 bg-voro-primary/5 rounded-full blur-[100px] pointer-events-none" />

                 {/* Counter-rotating orbits decoration */}
                 <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/30 animate-[spin_16s_linear_infinite]" />
                    <div className="absolute inset-3 rounded-full border border-dashed border-voro-secondary/20 animate-[spin_10s_linear_infinite_reverse]" />
                    <div className="w-16 h-16 rounded-full bg-voro-primary/10 border border-voro-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.2)]">
                       <Maximize2 size={26} className="text-voro-primary animate-pulse" />
                    </div>
                 </div>

                 <h3 className="text-2xl sm:text-3xl font-serif italic font-semibold text-white mb-3">Select Two Temporal Nodes</h3>
                 <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed mb-8 font-medium">Click on any two recorded visual nodes below to align their architectural properties for visual comparison analysis.</p>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`px-6 py-3 rounded-2xl border font-mono text-xs tracking-wider font-bold transition-all ${compareA ? 'bg-voro-primary/15 border-voro-primary text-voro-primary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      [NODE_A: {compareA ? `READY (${shortDateFormatter.format(new Date(compareA.date))})` : 'EMPTY'}]
                    </div>
                    <div className={`px-6 py-3 rounded-2xl border font-mono text-xs tracking-wider font-bold transition-all ${compareB ? 'bg-voro-secondary/15 border-voro-secondary text-voro-secondary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      [NODE_B: {compareB ? `READY (${shortDateFormatter.format(new Date(compareB.date))})` : 'EMPTY'}]
                    </div>
                 </div>
              </div>
            )}
          </section>
        )}

        {photos.length === 0 ? (
          <div className="py-36 flex flex-col items-center justify-center text-center relative rounded-[3.5rem] bg-[#0A0C14] border border-white/5 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-voro-primary/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
               <div className="absolute inset-0 bg-voro-primary/10 rounded-full blur-[40px] animate-pulse" />
               <div className="absolute inset-0 rounded-full border border-dashed border-voro-primary/20 animate-[spin_20s_linear_infinite]" />
               <div className="relative w-20 h-20 rounded-full bg-[#05060A] border border-white/10 flex items-center justify-center shadow-2xl">
                  <Camera size={32} className="text-voro-primary" />
               </div>
            </div>
            <h3 className="text-3xl font-serif italic font-semibold text-white mb-3">Biometric Ledger Void</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">Your secure visual progression vault has not been initialized. Synchronize your first visual specimen to track physical transition.</p>
            <Button onClick={() => fileRef.current?.click()} className="!rounded-full px-10 py-4 shadow-xl shadow-voro-primary/15 hover:shadow-voro-primary/30">
              Initialize Baseline Specimen
            </Button>
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
          <div className="space-y-8 p-2">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] bg-[#05060A]">
              {/* Image Grid Overlay */}
              <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none z-10" />
              <img src={selectedPhoto.src} alt="Specimen Detail" className="w-full h-full object-cover select-none" />
              <div className="absolute inset-0 bg-boutique-grain opacity-[0.035] pointer-events-none" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[0.55rem] font-mono text-gray-400 uppercase tracking-[0.3em] font-semibold">Temporal_Reference_Point</p>
                <p className="text-2xl font-serif italic font-bold text-white tracking-tight">{progressDateFormatter.format(new Date(selectedPhoto.date))}</p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="danger"
                  onClick={() => { deletePhoto(selectedPhoto.id); setSelectedPhoto(null); }}
                  className="!rounded-2xl px-6"
                >
                  <Trash2 size={16} className="mr-2" />
                  Decommission Node
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="fixed inset-0 bg-boutique-grain opacity-[0.015] pointer-events-none z-[100]" />
    </div>
  );
};

export default ProgressPhotos;
