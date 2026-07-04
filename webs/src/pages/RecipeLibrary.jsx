import React, { useEffect, useMemo } from 'react';
import { Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';

const RecipeLibrary = () => {
  const navigate = useNavigate();
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable, non-reactive action references.
   * This prevents re-rendering when unrelated storage keys change.
   * Note: We use 'recipes' instead of 'voro_recipes' to ensure the hook
   * correctly matches notifications from the storage utility.
   */
  const recipes = useStorageKey('recipes') || [];
  const { setItem } = useStorageMethods();

  useEffect(() => {
    document.title = 'VORO | Recipe Library';
  }, []);

  const handleDelete = async (id) => {
    const updated = recipes.filter(r => r.id !== id);
    await setItem('recipes', updated);
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Recipe Library</h1>
          <Button onClick={() => navigate('/nutrition/recipe-builder')}>
            Create Recipe
          </Button>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(recipe => (
              <Card key={recipe.id} className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{recipe.name}</h3>
                <div className="text-sm text-gray-400 mb-4">
                  {recipe.ingredients?.length || 0} ingredients • {recipe.servings} serving
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 bg-voro-surface rounded">
                    <div className="text-xs text-gray-400">Calories</div>
                    <div className="font-bold text-white">{Math.round(recipe.totals.calories)}</div>
                  </div>
                  <div className="p-2 bg-voro-surface rounded">
                    <div className="text-xs text-gray-400">Protein</div>
                    <div className="font-bold text-white">{recipe.totals.protein.toFixed(1)}g</div>
                  </div>
                  <div className="p-2 bg-voro-surface rounded">
                    <div className="text-xs text-gray-400">Carbs</div>
                    <div className="font-bold text-white">{recipe.totals.carbs.toFixed(1)}g</div>
                  </div>
                  <div className="p-2 bg-voro-surface rounded">
                    <div className="text-xs text-gray-400">Fat</div>
                    <div className="font-bold text-white">{recipe.totals.fat.toFixed(1)}g</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1">Log Recipe</Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(recipe.id)}
                    className="text-danger"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-white mb-2">No recipes yet</h3>
            <p className="text-gray-400 mb-6">Create your first recipe to get started</p>
            <Button onClick={() => navigate('/nutrition/recipe-builder')}>Create Recipe</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipeLibrary;
