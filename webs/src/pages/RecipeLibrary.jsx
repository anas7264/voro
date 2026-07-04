import React, { useEffect, useCallback } from 'react';
import { Trash2, Book, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

const RecipeLibrary = () => {
  const navigate = useNavigate();
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('recipes') for specific data
   * and useStorageMethods for stable action references.
   * ESTIMATED IMPACT: Eliminates redundant re-renders and mount-time useEffect cycles.
   */
  const recipes = useStorageKey('recipes') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  useEffect(() => {
    document.title = 'VORO | Recipe Library';
  }, []);

  const handleDelete = useCallback(async (id) => {
    const updated = recipes.filter(r => r.id !== id);
    await setItem('recipes', updated);
    addNotification('Recipe artifact purged from archive', 'info');
  }, [recipes, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-voro-primary mb-4">
              <Book size={18} />
              <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.4em]">Culinary Synthesis Archive</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
              Recipe <span className="text-voro-primary not-italic font-bold">Library</span>
            </h1>
          </div>

          <Button
            onClick={() => navigate('/nutrition/recipes/builder')}
            className="px-10 py-5 shadow-2xl shadow-voro-primary/20"
          >
            <Plus size={18} className="mr-3" />
            Create Recipe
          </Button>
        </header>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <Card key={recipe.id} className="group relative p-8 bg-[#0A0C14] border-white/5 hover:border-voro-primary/20 transition-all duration-700 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-voro-primary/10 transition-colors duration-1000" />

                <h3 className="text-2xl font-serif italic font-medium text-white tracking-tight mb-2 group-hover:text-voro-primary transition-colors">
                  {recipe.name}
                </h3>
                <div className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest mb-8">
                  {recipe.ingredients.length} ingredients • {recipe.servings} serving
                </div>

                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { label: 'Calories', val: Math.round(recipe.totals.calories), unit: 'kcal' },
                    { label: 'Protein', val: recipe.totals.protein.toFixed(1), unit: 'g' },
                    { label: 'Carbs', val: recipe.totals.carbs.toFixed(1), unit: 'g' },
                    { label: 'Fat', val: recipe.totals.fat.toFixed(1), unit: 'g' }
                  ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.05] transition-all">
                      <div className="text-[0.5rem] font-black text-gray-700 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-mono font-bold text-white">{stat.val}</span>
                        <span className="text-[0.6rem] font-mono text-gray-600">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-6 border-t border-white/5">
                  <Button variant="secondary" className="flex-1 py-4 text-[0.6rem] font-black uppercase tracking-widest">Log Recipe</Button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-700 hover:text-red-400 hover:bg-red-400/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Purge recipe"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-32 text-center border-dashed border-white/5 bg-transparent">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Book size={40} className="text-gray-800" />
            </div>
            <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Archive Void</h3>
            <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.3em]">No culinary patterns synthesized</p>
            <Button
              onClick={() => navigate('/nutrition/recipes/builder')}
              className="mt-10 px-12"
            >
              Initialize Synthesis
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipeLibrary;
