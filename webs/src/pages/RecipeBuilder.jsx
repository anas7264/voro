import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { validateRecipe } from '@/utils/validators';
import { foods } from '@/data/foods';

const RecipeBuilder = () => {
  const { getStorage, setStorage } = useStorage();
  const { addNotification } = useNotifications();
  const [ingredients, setIngredients] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    document.title = 'VORO | Recipe Builder';
    const data = getStorage('voro_recipes') || [];
    setSavedRecipes(data);
  }, []);

  const handleSearchFood = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = foods.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  };

  const handleAddIngredient = (food) => {
    setIngredients([...ingredients, { ...food, portion: 100 }]);
    setSearchQuery('');
    setFilteredFoods([]);
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const calculateTotals = () => {
    return ingredients.reduce((acc, ing) => ({
      calories: acc.calories + (ing.calories * ing.portion / 100),
      protein: acc.protein + (ing.protein * ing.portion / 100),
      carbs: acc.carbs + (ing.carbs * ing.portion / 100),
      fat: acc.fat + (ing.fat * ing.portion / 100),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSaveRecipe = () => {
    const recipe = {
      id: Date.now(),
      name: recipeName,
      ingredients,
      totals: calculateTotals(),
      servings: 1,
    };

    // Security: Validate recipe data before persisting to storage
    const { valid, errors } = validateRecipe(recipe);
    if (!valid) {
      const errorMsg = Object.values(errors)[0];
      addNotification(`Validation failed: ${errorMsg}`, 'error');
      return;
    }

    const updated = [...savedRecipes, recipe];
    setSavedRecipes(updated);
    setStorage('voro_recipes', updated);
    setRecipeName('');
    setIngredients([]);
    addNotification('Recipe saved successfully', 'success');
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Recipe Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create Recipe</h3>
              <Input
                placeholder="Recipe name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="mb-4"
              />

              <div className="mb-4">
                <label className="text-sm text-gray-400 block mb-2">Add Ingredients</label>
                <Input
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => handleSearchFood(e.target.value)}
                />
                {filteredFoods.length > 0 && (
                  <div className="absolute bg-voro-elevated rounded-lg mt-1 w-72 max-h-64 overflow-y-auto z-10">
                    {filteredFoods.map(food => (
                      <div
                        key={food.id}
                        onClick={() => handleAddIngredient(food)}
                        className="p-3 hover:bg-voro-surface cursor-pointer border-b border-voro-border text-white"
                      >
                        {food.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {ingredients.length > 0 && (
                <div className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-voro-surface rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{ing.name}</div>
                        <input
                          type="number"
                          value={ing.portion}
                          onChange={(e) => {
                            const updated = [...ingredients];
                            updated[idx].portion = Number(e.target.value);
                            setIngredients(updated);
                          }}
                          className="bg-voro-elevated text-white text-xs px-2 py-1 rounded w-20 mt-1"
                          placeholder="grams"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-danger"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleSaveRecipe} className="w-full mt-4">
                Save Recipe
              </Button>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Nutrition Summary</h3>
              <div className="space-y-3">
                <div className="p-3 bg-voro-surface rounded-lg">
                  <div className="text-xs text-gray-400">Calories</div>
                  <div className="text-2xl font-bold text-voro-primary">{Math.round(totals.calories)}</div>
                </div>
                <div className="p-3 bg-voro-surface rounded-lg">
                  <div className="text-xs text-gray-400">Protein</div>
                  <div className="text-xl font-bold text-voro-secondary">{totals.protein.toFixed(1)}g</div>
                </div>
                <div className="p-3 bg-voro-surface rounded-lg">
                  <div className="text-xs text-gray-400">Carbs</div>
                  <div className="text-xl font-bold text-voro-accent">{totals.carbs.toFixed(1)}g</div>
                </div>
                <div className="p-3 bg-voro-surface rounded-lg">
                  <div className="text-xs text-gray-400">Fat</div>
                  <div className="text-xl font-bold text-orange-400">{totals.fat.toFixed(1)}g</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Saved Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes.map(recipe => (
                <Card key={recipe.id} className="p-4">
                  <h4 className="text-lg font-bold text-white mb-2">{recipe.name}</h4>
                  <div className="text-sm text-gray-400 mb-3">
                    {Math.round(recipe.totals.calories)} kcal • {recipe.ingredients.length} ingredients
                  </div>
                  <Button variant="secondary" className="w-full">View Recipe</Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBuilder;
