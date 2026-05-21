import React, { useEffect } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';

const Offline = () => {
  useEffect(() => {
    document.title = 'VORO | Offline';
  }, []);

  return (
    <div className="min-h-screen bg-voro-surface flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-3xl font-bold text-white mb-2">You're Offline</h1>
        <p className="text-gray-400 mb-6">
          No internet connection detected. Your data is safely stored locally and will sync when you're back online.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Try Again
        </Button>
      </Card>
    </div>
  );
};

export default Offline;
