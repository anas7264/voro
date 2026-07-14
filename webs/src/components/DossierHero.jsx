import React, { memo, useRef, useState, useCallback, useMemo } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import Badge from './Badge';

/**
 * ⚡ REFINEMENT: Luxury Cinematic Dossier Hero.
 * Re-engineered to the 'Forge' luxury standard: features multi-layered cinematic parallax,
 * volumetric 3D transforms, and a 'Luminous Scanner' effect.
 *
 * DESIGN PHILOSOPHY:
 * 1. Cinematic: Parallax displacement of background imagery vs. foreground content.
 * 2. Precision: Surgical Reactivity via direct DOM manipulation of imageRef and contentRef.
 * 3. Authority: Architectural framing brackets with Playfair Display typography.
 * 4. Atmosphere: Luminous scanner beam suggesting active data ingestion/reading.
 */
const DossierHero = memo(({ article, onAction }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const scannerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !imageRef.current || !contentRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to 0.5)
    const nx = (x / rect.width) - 0.5;
    const ny = (y / rect.height) - 0.5;

    // Cinematic Parallax: Image moves opposite to content, slower
    const imgX = nx * -40; // Max 40px displacement
    const imgY = ny * -40;
    const contentX = nx * 30; // Max 30px displacement
    const contentY = ny * 30;

    // Volumetric 3D Tilt
    const tiltX = -ny * 10; // Max 10 deg
    const tiltY = nx * 10;

    // Apply styles directly for 60fps fluidity
    imageRef.current.style.transform = `translate3d(${imgX}px, ${imgY}px, 0) scale(1.1)`;
    contentRef.current.style.transform = `translate3d(${contentX}px, ${contentY}px, 60px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    if (scannerRef.current) {
        scannerRef.current.style.top = `${y}px`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (imageRef.current) imageRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
    if (contentRef.current) contentRef.current.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
  }, []);

  const initials = useMemo(() =>
    article.author.split(' ').map(n => n[0]).join(''),
  [article.author]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative h-[700px] w-full overflow-hidden rounded-[4rem] border border-white/5 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] bg-[#0A0C14] group"
      style={{ perspective: '1500px' }}
    >
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          ref={imageRef}
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out"
          style={{ transition: isHovered ? 'none' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/60 to-transparent" />
        <div className="absolute inset-0 bg-boutique-grain opacity-[0.03]" />
      </div>

      {/* Luminous Scanner Effect */}
      <div
        ref={scannerRef}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-voro-primary to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-20 blur-[1px]"
        style={{ transform: 'translateZ(100px)' }}
      />

      {/* Forensic Framing Brackets */}
      <div className="absolute inset-12 pointer-events-none z-10 border-l border-t border-white/10 w-12 h-12 rounded-tl-2xl transition-all duration-700 group-hover:inset-10 group-hover:border-voro-primary/40" />
      <div className="absolute inset-12 pointer-events-none z-10 border-r border-b border-white/10 w-12 h-12 rounded-br-2xl right-12 bottom-12 left-auto top-auto transition-all duration-700 group-hover:inset-10 group-hover:border-voro-primary/40" />

      {/* Kinetic Content Layer */}
      <div
        ref={contentRef}
        className="relative z-30 h-full flex flex-col justify-end p-16 md:p-24 space-y-10"
        style={{
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'none' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="space-y-6" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center gap-8">
            <Badge variant="voro-primary" dot className="px-5 py-2 font-black tracking-[0.3em] bg-voro-primary shadow-[0_0_20px_rgba(124,58,237,0.4)] border-white/20">
              PRIME_INTEL
            </Badge>
            <div className="flex items-center gap-3 text-gray-400 font-mono text-[0.65rem] uppercase tracking-[0.4em] opacity-60">
              <Clock size={14} className="text-voro-primary" />
              <span>{article.readTime} Analysis</span>
            </div>
          </div>

          <h2 className="text-5xl md:text-8xl font-serif italic font-medium text-white tracking-tighter leading-[0.95] max-w-5xl">
            {article.title}
          </h2>

          <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed max-w-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700">
            {article.excerpt}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 pt-8" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full bg-[#0A0C14] border border-white/10 flex items-center justify-center font-serif italic text-xl text-voro-primary overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                {initials}
            </div>
            <div>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-white">{article.author}</p>
              <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-[0.4em] mt-1">{article.date} Publication</p>
            </div>
          </div>

          <button
            onClick={onAction}
            className="group/btn relative px-12 py-5 bg-white text-black rounded-full text-[0.7rem] font-black uppercase tracking-[0.5em] transition-all duration-700 hover:scale-105 hover:shadow-[0_40px_80px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-0 group-hover/btn:opacity-10 transition-opacity" />
            <span className="relative z-10">Access Dossier</span>
            <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </button>
        </div>
      </div>

      {/* Industrial Telemetry Detailing */}
      <div className="absolute top-16 right-16 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
         <div className="font-mono text-[5rem] font-black leading-none select-none">
            0X{article.id}
         </div>
      </div>
    </section>
  );
});

DossierHero.displayName = "DossierHero";

export default DossierHero;
