import React, { useEffect, useMemo, useCallback } from 'react';
import { Trash2, BookOpen, Plus, Heart, Sparkles, Flame, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

const RecipeLibrary = () => {
  const navigate = useNavigate();
  const { setItem, getItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Subscribe only to the specific 'recipes' key. This ensures the component
   * only re-renders when the recipe protocol is modified.
   */
  const recipes = useStorageKey('recipes') || [];

  useEffect(() => {
    document.title = 'VORO | Culinary Codex';
  }, []);

  const handleDelete = useCallback(async (id, name) => {
    const updated = recipes.filter(r => r.id !== id);
    await setItem('recipes', updated);
    addNotification(`Formula "${name}" decommissioned from codex.`, 'info');
  }, [recipes, setItem, addNotification]);

  const handleLogRecipe = useCallback(async (recipe) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = { ...(getItem('nutrition_log') || {}) };
    const dayData = log[todayStr] || { meals: {}, water: 0, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
    const mealId = `recipe_${recipe.id}_${Date.now()}`;

    log[todayStr] = {
      ...dayData,
      meals: {
        ...dayData.meals,
        [mealId]: {
          name: recipe.name,
          calories: recipe.totals.calories,
          protein: recipe.totals.protein,
          carbs: recipe.totals.carbs,
          fat: recipe.totals.fat,
          timestamp: new Date().toISOString()
        }
      },
      totals: {
        calories: (dayData.totals?.calories || 0) + recipe.totals.calories,
        protein: (dayData.totals?.protein || 0) + recipe.totals.protein,
        carbs: (dayData.totals?.carbs || 0) + recipe.totals.carbs,
        fat: (dayData.totals?.fat || 0) + recipe.totals.fat,
      }
    };

    await setItem('nutrition_log', log);
    addNotification(`"${recipe.name}" nutrient profile synthesized into today's matrix`, 'success');
  }, [getItem, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-32 relative overflow-hidden">
      {/* Editorial Ambient background depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-voro-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 md:px-12 lg:px-20">

        {/* Luxury Status Header Section (Golden Ratio White Space) */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 group/header">
          <div className="space-y-6 max-w-3xl">
            {/* Active Neural Pulse Eyebrow */}
            <div className="flex items-center gap-4 text-voro-primary">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-voro-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]"></span>
              </div>
              <span className="text-[0.7rem] font-mono font-black uppercase tracking-[0.6em]">
                Culinary Codex // Nutritional Database
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-[4.5rem] md:text-[6.5rem] font-serif italic font-medium tracking-[-0.04em] text-white leading-[0.9] mb-2">
                Recipe <span className="text-gradient not-italic font-black">Archive</span>
              </h1>
              <p className="text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-70 leading-relaxed max-w-xl">
                A premium catalog of dense, structured formulations optimized for thermal adaptation and energy balance.
              </p>
            </div>

            {/* Architectural Datum Line */}
            <div className="flex items-center gap-6 pt-2">
              <div className="h-px w-24 bg-gradient-to-r from-voro-primary to-transparent opacity-40 group-hover/header:w-48 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <p className="text-gray-600 font-mono font-bold tracking-[0.4em] text-[0.55rem] uppercase opacity-50 whitespace-nowrap">Node Ref: 0xCUL_ARCH</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/nutrition/recipe-builder')}
              className="px-8 py-5 !rounded-full shadow-2xl shadow-voro-primary/20 hover:scale-[1.05] transition-all"
            >
              <Plus size={18} className="mr-2" />
              Create Recipe
            </Button>
          </div>
        </header>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, idx) => (
              <Card
                key={recipe.id}
                variant="premium"
                nodeId={`REC_0${(idx + 1) % 10}`}
                className="p-10 flex flex-col justify-between"
              >
                <div className="space-y-8">
                  {/* Category and Quick Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-voro-primary" />
                      <span className="text-[0.6rem] font-mono font-bold text-gray-500 uppercase tracking-widest">
                        {recipe.ingredients?.length || 0} Compounds
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">
                      {recipe.servings || 1} Serving
                    </div>
                  </div>

                  {/* Header Title */}
                  <h3 className="text-2xl font-serif italic font-medium text-white group-hover:text-voro-primary transition-colors leading-snug">
                    {recipe.name}
                  </h3>

                  {/* High-fidelity Macro Matrix */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
                      <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest block">Energy</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xl font-serif italic font-bold text-white">{Math.round(recipe.totals.calories)}</span>
                        <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black">kcal</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
                      <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest block">Protein</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xl font-serif italic font-bold text-voro-primary">{recipe.totals.protein.toFixed(1)}</span>
                        <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black">g</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
                      <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest block">Carbs</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xl font-serif italic font-bold text-voro-secondary">{recipe.totals.carbs.toFixed(1)}</span>
                        <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black">g</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
                      <span className="text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest block">Fat</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xl font-serif italic font-bold text-voro-accent">{recipe.totals.fat.toFixed(1)}</span>
                        <span className="text-[0.55rem] font-mono text-gray-600 uppercase font-black">g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tactile Controls */}
                <div className="flex gap-4 pt-10 mt-6 border-t border-white/5">
                  <button
                    onClick={() => handleLogRecipe(recipe)}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-voro-primary text-white text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_20px_40px_rgba(124,58,237,0.3)] shadow-none outline-none focus-visible:ring-2 focus-visible:ring-voro-primary"
                  >
                    <Plus size={14} />
                    <span>Synthesize</span>
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id, recipe.name)}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-gray-600 hover:text-voro-danger hover:bg-voro-danger/10 hover:border-voro-danger/20 transition-all duration-500"
                    aria-label={`Decommission ${recipe.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* High-end empty state: Codex Void */
          <div className="py-32 text-center max-w-xl mx-auto space-y-12">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-voro-primary/20 animate-[spin_30s_linear_infinite]" />
              <div className="w-24 h-24 rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center justify-center shadow-2xl">
                <BookOpen size={36} className="text-voro-primary/80" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic font-medium text-white tracking-tight">
                Codex <span className="text-voro-primary not-italic font-bold">Void</span>
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                No custom recipes currently synthesized into the archive. Map out a new nutritional blueprint and register it in the local database.
              </p>
            </div>

            <Button
              onClick={() => navigate('/nutrition/recipe-builder')}
              className="px-10 py-5 !rounded-full shadow-2xl shadow-voro-primary/20 hover:scale-[1.05] transition-all"
            >
              <Plus size={18} className="mr-3" />
              <span>Map New Formula</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeLibrary;
