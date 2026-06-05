import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { foods } from '@/data/foods';

const PAGE_SIZE = 24;

const FoodLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = 'VORO | Food Library';
  }, []);

  /**
   * ⚡ OPTIMIZATION: Reset visible count when filters change to maintain performance.
   */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory]);

  /**
   * ⚡ OPTIMIZATION: Memoize categories to avoid O(N) extraction on every render.
   */
  const categories = useMemo(() => ['All', ...new Set(foods.map(f => f.category))], []);

  /**
   * ⚡ OPTIMIZATION: Replace useEffect + useState pattern with useMemo for filtering.
   * This eliminates the double-render cycle and provides cleaner data derivation.
   */
  const filteredFoods = useMemo(() => {
    let filtered = foods;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (foodId) => {
    setFavorites(prev =>
      prev.includes(foodId)
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Food Library</h1>

        {/* Search & Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search size={18} />}
            />

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.slice(0, visibleCount).map(food => (
            <Card key={food.id} className="p-4 hover:border-voro-primary transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{food.name}</h3>
                  <p className="text-xs text-gray-400">{food.category}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(food.id)}
                  className="text-gray-400 hover:text-red-400 transition-all"
                >
                  <Heart
                    size={18}
                    fill={favorites.includes(food.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="bg-voro-surface p-3 rounded-lg mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Calories</span>
                    <div className="font-bold text-white">{food.calories}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Protein</span>
                    <div className="font-bold text-voro-primary">{food.protein}g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Carbs</span>
                    <div className="font-bold text-voro-secondary">{food.carbs}g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Fat</span>
                    <div className="font-bold text-voro-accent">{food.fat}g</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Per 100g</div>
              </div>

              <div className="flex gap-2 flex-wrap mb-3">
                {food.isVegetarian && <Badge color="success" size="sm">🌱 Veg</Badge>}
                {food.isVegan && <Badge color="success" size="sm">🌿 Vegan</Badge>}
                {food.isGlutenFree && <Badge color="info" size="sm">✓ GF</Badge>}
                {food.isHalal && <Badge size="sm">✓ Halal</Badge>}
              </div>

              <Button variant="secondary" size="sm" className="w-full">
                View Details
              </Button>
            </Card>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No foods found</p>
          </div>
        )}

        {visibleCount < filteredFoods.length && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              className="px-12 py-4 rounded-full text-[0.65rem] font-black uppercase tracking-[0.4em] border-white/10 hover:bg-white/5"
            >
              Load More Foods
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLibrary;
