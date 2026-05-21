import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'VORO | Page Not Found';
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="w-full">
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
