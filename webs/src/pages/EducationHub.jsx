import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, Clock, ArrowUpRight, Search, Bookmark, Share2, Sparkles, Filter, Newspaper } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Accordion from '@/components/Accordion';

const EducationHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

        {/* Featured Intelligence Hero */}
        {!searchQuery && activeCategory === 'All' && featuredArticle && (
          <section className="mb-24 group">
            <Card className="p-0 relative h-[600px] w-full overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-10 md:p-16 max-w-4xl space-y-8">
                <div className="flex items-center gap-6">
                  <Badge variant="voro-primary" dot className="px-4 py-1.5 font-black tracking-widest">
                    Featured Insight
                  </Badge>
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-[0.6rem] uppercase tracking-widest">
                    <Clock size={12} />
                    <span>{featuredArticle.readTime} reading depth</span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl opacity-80">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-voro-primary flex items-center justify-center font-bold text-white text-xs">
                      {featuredArticle.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-widest text-white">{featuredArticle.author}</p>
                      <p className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">{featuredArticle.date} Edition</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[0.65rem] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                    Access Dossier
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          </section>
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
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="text-gray-500 hover:text-white transition-colors"><Bookmark size={14} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><Share2 size={14} /></button>
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
                  <button className="text-voro-primary flex items-center gap-2 text-[0.55rem] font-black uppercase tracking-[0.2em]">
                    Read Dossier
                    <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
              <button className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary uppercase tracking-[0.3em] transition-colors">Publication Ethics</button>
              <button className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary uppercase tracking-[0.3em] transition-colors">Archive Access</button>
              <button className="text-[0.6rem] font-black text-gray-600 hover:text-voro-primary uppercase tracking-[0.3em] transition-colors">Neural Sync</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default EducationHub;
