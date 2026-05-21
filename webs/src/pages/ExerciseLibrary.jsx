import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { exercises } from '@/data/exercises';

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  const categories = ['All', ...new Set(exercises.map(e => e.category))];

  useEffect(() => {
    document.title = 'VORO | Exercise Library';
    let filtered = exercises;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Exercise Library</h1>

        {/* Search & Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <Input
              placeholder="Search exercises..."
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

        {/* Exercises Grid */}
        <div className="space-y-3">
          {filteredExercises.map(exercise => (
            <Card key={exercise.id} className="p-4 hover:border-voro-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{exercise.name}</h3>
                  <div className="flex gap-2 flex-wrap items-center mb-2">
                    <Badge size="sm">{exercise.category}</Badge>
                    <Badge size="sm" color="secondary">{exercise.difficulty}</Badge>
                    {exercise.isBodyweight && <Badge size="sm" color="success">Bodyweight</Badge>}
                  </div>
                  <p className="text-sm text-gray-400">{exercise.description}</p>
                </div>
                <Button variant="secondary" size="sm" className="ml-4">
                  Add
                </Button>
              </div>
              
              {exercise.tips && exercise.tips.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  <p className="font-semibold text-gray-400 mb-1">Tips:</p>
                  <ul className="list-disc list-inside">
                    {exercise.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No exercises found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
