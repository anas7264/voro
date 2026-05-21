import React, { useEffect } from 'react';
import Card from '@/components/Card';

const EducationHub = () => {
  useEffect(() => {
    document.title = 'VORO | Education Hub';
  }, []);

  const articles = [
    {
      id: 1,
      title: 'Understanding Your Macronutrients',
      category: 'Nutrition',
      readTime: '5 min',
      excerpt: 'Learn about protein, carbs, and fats and how they fuel your body...'
    },
    {
      id: 2,
      title: 'Progressive Overload: The Engine of Muscle Growth',
      category: 'Training',
      readTime: '7 min',
      excerpt: 'Discover how to consistently challenge your muscles for growth...'
    },
    {
      id: 3,
      title: 'Recovery, Rest, and Sleep',
      category: 'Recovery',
      readTime: '6 min',
      excerpt: 'Why rest is just as important as training for results...'
    },
    {
      id: 4,
      title: 'The Levantine Diet: A Nutritional Powerhouse',
      category: 'Nutrition',
      readTime: '8 min',
      excerpt: 'Explore why Palestinian and Levantine cuisine is incredibly healthy...'
    },
  ];

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Education Hub</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map(article => (
            <Card key={article.id} className="p-6 hover:border-voro-primary transition-all cursor-pointer">
              <div className="text-sm text-voro-primary font-semibold mb-2">{article.category}</div>
              <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{article.excerpt}</p>
              <div className="text-xs text-gray-500">📖 {article.readTime} read</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationHub;
