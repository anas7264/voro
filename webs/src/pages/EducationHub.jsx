import React, { useEffect, useState, useMemo, useRef, memo } from 'react';
import { BookOpen, Clock, ArrowUpRight, Search, Bookmark, Share2, Sparkles, Filter, Newspaper } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Accordion from '@/components/Accordion';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * ⚡ REFINEMENT: Cinematic Dossier Hero Component.
 * Features multi-layered parallax, volumetric 3D transforms, and industrial telemetry.
 * Utilizes 'Surgical Reactivity' via direct DOM manipulation for 60fps performance.
 */
const DossierHero = memo(({ article, onAccessDossier }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates (-0.5 to 0.5)
    const nx = (x / rect.width) - 0.5;
    const ny = (y / rect.height) - 0.5;

    // Direct DOM manipulation for buttery performance
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(1.1) translate3d(${nx * 40}px, ${ny * 40}px, 0)`;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(${nx * -25}px, ${ny * -25}px, 60px) rotateX(${ny * -12}deg) rotateY(${nx * 12}deg)`;
    }

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(1) translate3d(0, 0, 0)`;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(0, 0, 0) rotateX(0) rotateY(0)`;
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[750px] w-full overflow-hidden rounded-[4rem] border border-white/5 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] group/hero perspective-[2000px] mb-24"
    >
      {/* Cinematic Background Layer with Parallax */}
      <div className="absolute inset-0 bg-[#020408]">
        <img
          ref={imageRef}
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out opacity-60 grayscale group-hover/hero:grayscale-0 group-hover/hero:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/40 to-transparent" />
      </div>

      {/* Luminous Scanner Aura */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(1000px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.12), transparent 60%)`
        }}
      />

      {/* Architectural Framing Brackets */}
      <div className="absolute inset-16 pointer-events-none border border-white/5 rounded-[3rem] transition-all duration-1000 group-hover/hero:inset-12">
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-voro-primary/40 rounded-tl-[2.5rem] -translate-x-2 -translate-y-2" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-voro-primary/40 rounded-tr-[2.5rem] translate-x-2 -translate-y-2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-voro-primary/40 rounded-bl-[2.5rem] -translate-x-2 translate-y-2" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-voro-primary/40 rounded-br-[2.5rem] translate-x-2 translate-y-2" />
      </div>

      {/* Volumetric Hero Content */}
      <div
        ref={contentRef}
        className="absolute bottom-24 left-24 right-24 z-10 transition-transform duration-700 ease-out preserve-3d pointer-events-none"
      >
        <div className="max-w-5xl space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <Badge variant="voro-primary" dot className="px-8 py-2.5 font-black tracking-[0.4em] backdrop-blur-3xl bg-voro-primary/20 border-white/10 pointer-events-auto">
                Priority Dossier
              </Badge>
              <div className="flex items-center gap-4 text-gray-400 font-mono text-[0.75rem] uppercase tracking-[0.5em]">
                <Clock size={16} className="text-voro-primary animate-pulse" />
                <span>Archive Depth: {article.readTime}</span>
              </div>
            </div>

            <h2 className="text-6xl md:text-[6.5rem] font-serif italic font-medium text-white tracking-tighter leading-[0.85] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              {article.title}
            </h2>

            <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed max-w-4xl opacity-90 drop-shadow-lg">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-12 pt-6">
            <div className="flex items-center gap-6 pointer-events-auto group/author">
              <div className="w-16 h-16 rounded-full bg-voro-primary/20 backdrop-blur-xl border border-white/10 flex items-center justify-center font-serif italic text-white text-2xl shadow-2xl transition-all duration-500 group-hover/author:border-voro-primary/40 group-hover/author:scale-110">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <p className="text-[0.85rem] font-black uppercase tracking-[0.4em] text-white">{article.author}</p>
                <p className="text-[0.65rem] font-mono text-voro-primary/60 uppercase tracking-[0.5em]">{article.date} Publication</p>
              </div>
            </div>

            <button
              onClick={() => onAccessDossier?.(article.title)}
              className="group/btn relative flex items-center gap-6 px-14 py-7 bg-white text-black rounded-full text-[0.8rem] font-black uppercase tracking-[0.6em] transition-all duration-700 hover:scale-110 hover:shadow-[0_60px_100px_rgba(255,255,255,0.25)] active:scale-95 pointer-events-auto overflow-hidden focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-voro-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#020408] outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-voro-primary/30 via-transparent to-transparent opacity-0 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 transition-opacity duration-1000" />
              <span className="relative z-10">Access Dossier</span>
              <ArrowUpRight size={20} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 group-focus-visible/btn:translate-x-1 group-focus-visible/btn:-translate-y-1 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Industrial Telemetry Feed */}
      <div className="absolute top-20 right-20 pointer-events-none flex flex-col items-end gap-3 font-mono text-[0.55rem] font-black text-white/20 uppercase tracking-[0.6em]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_8px_#7C3AED] animate-pulse" />
          <span>Specimen_Ref: 0x{article.id.toString().padStart(4, '0')}</span>
        </div>
        <span>Neural_Sync: Nominal</span>
        <span>Provenance: Verified</span>
      </div>

      <div className="absolute inset-0 bg-boutique-grain opacity-[0.05] pointer-events-none" />
    </section>
  );
});

DossierHero.displayName = 'DossierHero';

const EducationHub = () => {
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const handleToggleBookmark = (id, title) => {
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(id);
      if (isBookmarked) {
        addNotification(`Removed "${title}" from your bookmarks.`, 'info');
        return prev.filter((bookmarkId) => bookmarkId !== id);
      } else {
        addNotification(`Saved "${title}" to your bookmarks successfully!`, 'success');
        return [...prev, id];
      }
    });
  };

  const handleShare = (title) => {
    const shareUrl = `${window.location.origin}/education/article/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        addNotification('Dossier share link copied to clipboard successfully.', 'success');
      })
      .catch(() => {
        addNotification('Unable to copy share link to clipboard.', 'error');
      });
  };

  const handleReadDossier = (title) => {
    addNotification(`Syncing metadata for "${title}"...`, 'info');
  };

  const handleFooterClick = (label) => {
    addNotification(`Accessing ${label} secure channel...`, 'info');
  };

  useEffect(() => {
    document.title = 'VORO | Intellectual Archive';
  }, []);

  const articles = useMemo(() => [
    {
      id: 1,
      title: 'Biological Fuel: Decoding Macronutrient Synthesis',
      category: 'Nutrition',
      readTime: '8 min',
      author: 'Dr. Elias Vance',
      date: 'May 2024',
      tags: ['Metabolic', 'Synthesis'],
      excerpt: 'An exhaustive exploration of protein, carbohydrates, and lipids. Understand the kinetic conversion of energy and how to optimize your metabolic trajectory.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000'
    },
    {
      id: 2,
      title: 'Hypertrophic Architecture: The Progressive Overload Doctrine',
      category: 'Training',
      readTime: '12 min',
      author: 'Aria Thorne',
      date: 'June 2024',
      tags: ['Hypertrophy', 'Force'],
      excerpt: 'Master the mechanical tension, metabolic stress, and muscle damage triad. A scientific blueprint for consistent physiological adaptation and force production.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 3,
      title: 'Circadian Optimization: The Neural Recovery Protocol',
      category: 'Recovery',
      readTime: '10 min',
      author: 'Marcus Chen',
      date: 'April 2024',
      tags: ['Circadian', 'Neural'],
      excerpt: 'Investigate the profound impact of sleep architecture on endocrine health and kinetic performance. Strategies for deep REM-state maximization.',
      image: 'https://images.unsplash.com/photo-1541480605637-296291a24d9d?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 4,
      title: 'The Levantine Matrix: Ancient Wisdom in Modern Nutrition',
      category: 'Nutrition',
      readTime: '15 min',
      author: 'Sama Haddad',
      date: 'July 2024',
      tags: ['Levantine', 'Longevity'],
      excerpt: 'Decoding the nutritional density of Palestinian and Levantine cuisine. A longitudinal analysis of the world’s most potent longevity diets.',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 5,
      title: 'Endocrine Equilibrium: Managing Cortisol in High-Performance States',
      category: 'Recovery',
      readTime: '7 min',
      author: 'Dr. Sarah Miller',
      date: 'August 2024',
      tags: ['Hormonal', 'Balance'],
      excerpt: 'Strategies for balancing the sympathetic and parasympathetic nervous systems during intensive training cycles to prevent overreaching.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 6,
      title: 'Kinetic Mechanics: The Physics of the Deadlift',
      category: 'Training',
      readTime: '9 min',
      author: 'Coach J. Richards',
      date: 'September 2024',
      tags: ['Biomechanics', 'Power'],
      excerpt: 'A deep dive into leverage, center of mass, and spinal stabilization. Optimize your pull for maximum efficiency and structural integrity.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000'
    }
  ], []);

  const categories = ['All', ...new Set(articles.map(a => a.category))];

  const featuredArticle = useMemo(() => articles.find(a => a.featured), [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (article.featured && activeCategory === 'All' && !searchQuery) return false;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24 relative overflow-hidden">
      {/* Ambient Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-voro-primary">
              <Newspaper size={18} />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Knowledge Synthesis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic font-medium tracking-tight text-white leading-tight">
              Intellectual <span className="text-gradient not-italic font-bold">Archive</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60 leading-relaxed">
              A curated anthology of biological optimization research and longitudinal performance studies.
            </p>
          </div>

          <div className="w-full md:w-[400px] space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-voro-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Query Research Database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-mono tracking-wider focus:outline-none focus:border-voro-primary focus:ring-1 focus:ring-voro-primary transition-all placeholder:text-gray-700"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[0.55rem] font-black uppercase tracking-[0.2em] transition-all border ${
                    activeCategory === cat
                      ? 'bg-voro-primary text-white border-voro-primary shadow-lg shadow-voro-primary/20'
                      : 'bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Cinematic Dossier Hero */}
        {!searchQuery && activeCategory === 'All' && featuredArticle && (
          <DossierHero article={featuredArticle} onAccessDossier={handleReadDossier} />
        )}

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <Card
              key={article.id}
              className="p-0 group relative flex flex-col bg-[#0A0C14] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-voro-primary/20 hover:translate-y-[-8px] shadow-xl animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[0.55rem] font-black text-white uppercase tracking-widest">
                    {article.category}
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[0.55rem] uppercase tracking-widest">
                    <Clock size={10} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all">
                    <button
                      onClick={() => handleToggleBookmark(article.id, article.title)}
                      aria-label={`${bookmarkedIds.includes(article.id) ? 'Remove bookmark' : 'Bookmark'}: ${article.title}`}
                      className="text-gray-500 hover:text-white focus-visible:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded-md p-1.5 bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                      {bookmarkedIds.includes(article.id) ? (
                        <Bookmark size={14} className="fill-current text-voro-primary" />
                      ) : (
                        <Bookmark size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(article.title)}
                      aria-label={`Copy share link for: ${article.title}`}
                      className="text-gray-500 hover:text-white focus-visible:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded-md p-1.5 bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-serif italic font-medium text-white mb-4 leading-tight tracking-tight group-hover:text-voro-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3 font-light">
                  {article.excerpt}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[0.55rem] font-black text-gray-600 uppercase tracking-widest">{article.author}</span>
                  <button
                    onClick={() => handleReadDossier(article.title)}
                    className="group/rd text-voro-primary flex items-center gap-2 text-[0.55rem] font-black uppercase tracking-[0.2em] outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded-md px-2 py-1 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  >
                    Read Dossier
                    <ArrowUpRight size={12} className="group-hover/rd:translate-x-1 group-hover/rd:-translate-y-1 group-focus-visible/rd:translate-x-1 group-focus-visible/rd:-translate-y-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-40 text-center space-y-8 animate-fade-in">
             <div className="w-24 h-24 mx-auto bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center shadow-inner">
                <Search size={40} className="text-gray-800" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 font-serif italic text-2xl">No Research Found</p>
                <p className="text-[0.6rem] text-gray-600 uppercase font-black tracking-[0.3em]">Query returned zero biological artifacts</p>
              </div>
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                Reset Archive
              </Button>
          </div>
        )}

        <section className="mt-32 mb-32">
          <header className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic font-medium text-white tracking-tight mb-4">
              Frequently Asked <span className="text-voro-primary not-italic font-bold">Questions</span>
            </h2>
            <p className="text-gray-500 font-mono text-[0.6rem] uppercase tracking-[0.3em]">Neural Knowledge Base v2.0</p>
          </header>
          <Accordion
            items={[
              {
                title: "How is metabolic velocity calculated?",
                content: "Metabolic velocity is derived from a multi-variant analysis of your basal metabolic rate (BMR) and total daily energy expenditure (TDEE), adjusted in real-time based on logged kinetic activities and thermal dynamic intake."
              },
              {
                title: "What is the Anabolic Potential Matrix?",
                content: "The matrix utilizes your fat-free mass index (FFMI) compared against longitudinal data of drug-free elite athletes to estimate your physiological ceiling for muscle synthesis and force production."
              },
              {
                title: "How secure is my biometric telemetry?",
                content: "All biometric data is processed within a zero-trust provenance model. Data is stored locally using AES-256 equivalent encryption in your browser's secure enclave, and all network sinks are gated by Neural Command Attestation."
              }
            ]}
          />
        </section>

        <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-6">
              <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.4em]">VORO Research Journal</span>
              <div className="w-1 h-1 rounded-full bg-gray-800" />
              <span className="text-[0.6rem] font-black text-gray-600 uppercase tracking-[0.4em]">Est. 2024</span>
           </div>
           <div className="flex gap-12">
              <button
                onClick={() => handleFooterClick('Publication Ethics')}
                className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary focus-visible:text-white uppercase tracking-[0.3em] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded px-1.5 py-0.5"
              >
                Publication Ethics
              </button>
              <button
                onClick={() => handleFooterClick('Archive Access')}
                className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary focus-visible:text-white uppercase tracking-[0.3em] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded px-1.5 py-0.5"
              >
                Archive Access
              </button>
              <button
                onClick={() => handleFooterClick('Neural Sync')}
                className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary focus-visible:text-white uppercase tracking-[0.3em] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-voro-primary rounded px-1.5 py-0.5"
              >
                Neural Sync
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default EducationHub;
