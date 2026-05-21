import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { LoadingSpinner } from './LoadingSpinner';

const OnboardingGuard = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <LoadingSpinner fullscreen />
      </div>
    );
  }

  // If no user profile, redirect to onboarding
  if (!user || !user.name) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default OnboardingGuard;
