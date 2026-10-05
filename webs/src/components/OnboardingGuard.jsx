import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * ⚡ REFINEMENT: Luxury Onboarding Access & Identity Guard Enclave ('OnboardingGuard').
 * Re-engineered conforming to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features Memoized wrapper execution, JSDoc architectural documentation, and seamless
 * spatial loading transition with full-screen neural synthesis matrix.
 */
const OnboardingGuard = memo(({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080B14]">
        <LoadingSpinner fullscreen message="Authenticating Subject Specimen" />
      </div>
    );
  }

  // If no user profile, redirect to onboarding
  if (!user || !user.name) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
});

OnboardingGuard.displayName = "OnboardingGuard";

export default OnboardingGuard;
