import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Search, Zap, Activity, Info } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateRecipe } from '@/utils/validators';
import { foods } from '@/data/foods';

const RecipeBuilder = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('recipes') for specific data
   * and useStorageMethods for stable action references.
   * ESTIMATED IMPACT: Eliminates redundant re-renders and O(N) mount-time syncs.
   */
  const savedRecipes = useStorageKey('recipes') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();

  const [ingredients, setIngredients] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'VORO | Recipe Builder';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Memoized search logic.
   * Prevents O(N) filtering operations on every render cycle.
   */
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return foods.filter(f =>
      f.name.toLowerCase().includes(query) ||
      (f.category && f.category.toLowerCase().includes(query))
    ).slice(0, 10);
  }, [searchQuery]);

  const handleAddIngredient = useCallback((food) => {
    setIngredients(prev => [...prev, { ...food, portion: 100, localId: Date.now() }]);
    setSearchQuery('');
  }, []);

  const handleRemoveIngredient = useCallback((localId) => {
    setIngredients(prev => prev.filter(ing => ing.localId !== localId));
  }, []);

  const updatePortion = useCallback((localId, portion) => {
    setIngredients(prev => prev.map(ing =>
      ing.localId === localId ? { ...ing, portion: Number(portion) } : ing
    ));
  }, []);

  /**
   * ⚡ OPTIMIZATION: Memoized totals calculation.
   */
  const totals = useMemo(() => {
    return ingredients.reduce((acc, ing) => {
      const multiplier = ing.portion / 100;
      return {
        calories: acc.calories + (ing.calories * multiplier),
        protein: acc.protein + (ing.protein * multiplier),
        carbs: acc.carbs + (ing.carbs * multiplier),
        fat: acc.fat + (ing.fat * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [ingredients]);

  const handleSaveRecipe = useCallback(async () => {
    const recipe = {
      id: Date.now(),
      name: recipeName,
      ingredients,
      totals,
      servings: 1,
    };

    const { valid, errors } = validateRecipe(recipe);
    if (!valid) {
      addNotification(Object.values(errors)[0], 'error');
      return;
    }

    const updated = [...savedRecipes, recipe];
    await setItem('recipes', updated);

    setRecipeName('');
    setIngredients([]);
    addNotification('Culinary archetype archived', 'success');
  }, [recipeName, ingredients, totals, savedRecipes, setItem, addNotification]);

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-12 lg:px-20">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <Activity size={18} />
            <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.4em]">Recipe Architecture Module</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Recipe <span className="text-voro-primary not-italic font-bold">Builder</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Builder UI */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="p-10 bg-[#0A0C14] border-white/5 shadow-2xl space-y-10">
              <div className="space-y-4">
                <label className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Pattern Designation</label>
                <Input
                  placeholder="Designate recipe name..."
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="bg-white/[0.02] border-white/10 italic font-serif text-lg"
                />
              </div>

              <div className="space-y-4 relative">
                <label className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Component Integration</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-voro-primary transition-colors">
                    <Search size={18} />
                  </div>
                  <Input
                    placeholder="Search biological fuel units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 bg-white/[0.02] border-white/10"
                  />
                </div>

                {filteredFoods.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#0A0C14] border border-white/10 rounded-[2rem] mt-4 max-h-72 overflow-y-auto z-50 shadow-3xl backdrop-blur-3xl no-scrollbar">
                    {filteredFoods.map(food => (
                      <button
                        key={food.id}
                        onClick={() => handleAddIngredient(food)}
                        className="w-full text-left p-6 hover:bg-voro-primary/[0.05] border-b border-white/[0.03] last:border-none transition-all group/item"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white group-hover/item:text-voro-primary transition-colors uppercase tracking-tight">{food.name}</span>
                          <span className="text-[0.6rem] font-mono text-gray-600 group-hover/item:text-voro-primary/60">{food.calories} kcal / 100g</span>
                        </div>
                        <span className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest">{food.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {ingredients.length > 0 && (
                <div className="space-y-4 pt-10 border-t border-white/5">
                  <label className="text-[0.6rem] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Integrated Matrix</label>
                  <div className="space-y-3">
                    {ingredients.map((ing) => (
                      <div key={ing.localId} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group/ing hover:border-white/10 transition-all">
                        <div className="flex-1 space-y-1">
                          <div className="text-white font-serif italic text-lg tracking-tight">{ing.name}</div>
                          <div className="flex items-center gap-4 text-[0.55rem] font-mono text-gray-600 uppercase tracking-widest">
                            <span>P: {(ing.protein * ing.portion/100).toFixed(1)}g</span>
                            <span>C: {(ing.carbs * ing.portion/100).toFixed(1)}g</span>
                            <span>F: {(ing.fat * ing.portion/100).toFixed(1)}g</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <input
                              type="number"
                              value={ing.portion}
                              onChange={(e) => updatePortion(ing.localId, e.target.value)}
                              className="w-24 bg-transparent border-b border-white/10 focus:border-voro-primary focus:outline-none py-1 text-right font-mono font-bold text-white"
                            />
                            <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-[0.5rem] font-black text-gray-700 uppercase">g</span>
                          </div>

                          <button
                            onClick={() => handleRemoveIngredient(ing.localId)}
                            className="p-3 rounded-xl text-gray-800 hover:text-red-400 hover:bg-red-400/5 transition-all opacity-0 group-hover/ing:opacity-100 focus:opacity-100"
                            aria-label="Remove ingredient"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveRecipe}
                className="w-full h-20 shadow-2xl shadow-voro-primary/20 text-lg tracking-[0.3em] font-black mt-8"
                disabled={!recipeName || ingredients.length === 0}
              >
                ARCHIVE ARCHETYPE
              </Button>
            </Card>
          </div>

          {/* Telemetry Display */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="p-10 bg-gradient-to-b from-[#0A0C14] to-black border-white/5 shadow-2xl relative overflow-hidden group/telemetry">
              <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover/telemetry:bg-voro-primary/10 transition-colors" />

              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-voro-primary/10 text-voro-primary rounded-2xl border border-voro-primary/20">
                  <Zap size={18} />
                </div>
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gray-500">Biological Telemetry</h3>
              </div>

              <div className="space-y-10">
                {[
                  { label: 'Energy Flux', val: Math.round(totals.calories), unit: 'kcal', color: 'text-white', sub: 'Total Caloric Density' },
                  { label: 'Protein Density', val: totals.protein.toFixed(1), unit: 'g', color: 'text-voro-primary', sub: 'Structural Nitrogen Matrix' },
                  { label: 'Carbohydrate Load', val: totals.carbs.toFixed(1), unit: 'g', color: 'text-voro-secondary', sub: 'Glycogen Energy Potential' },
                  { label: 'Lipid Profile', val: totals.fat.toFixed(1), unit: 'g', color: 'text-voro-accent', sub: 'Essential Adipose Flux' }
                ].map(stat => (
                  <div key={stat.label} className="group/stat">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[0.55rem] font-black text-gray-600 uppercase tracking-[0.3em] group-hover/stat:text-gray-400 transition-colors">{stat.label}</span>
                      <span className="text-[0.45rem] font-mono text-gray-800 uppercase tracking-widest">{stat.sub}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-serif italic font-bold ${stat.color}`}>{stat.val}</span>
                      <span className="text-[0.6rem] font-mono font-black text-gray-700 uppercase tracking-widest">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-10 space-y-6 bg-transparent border-dashed border-white/5">
              <div className="flex items-center gap-3">
                <Info size={16} className="text-voro-primary opacity-50" />
                <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-gray-600">Synthesis Protocol</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-mono">
                Ensuring high-fidelity nutritional synthesis requires precise magnitude entry. Use the grams input to calibrate each fuel unit.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBuilder;
