import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { areCookiesEnabled } from '@/lib/cookies';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';
import CookieWarning from '@/components/CookieWarning';

// Lazy load screens for better performance
const OnboardingScreen = lazy(() => import('@/components/OnboardingScreen'));
const DashboardScreen = lazy(() => import('@/components/DashboardScreen'));
const VictoryScreen = lazy(() => import('@/components/VictoryScreen'));

/**
 * Main application page
 * Routes between Onboarding, Dashboard, and Victory screens
 */
const Index = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);
  
  const {
    userData,
    currentDay,
    isComplete,
    isLoading,
    saveUserData,
    getDayData,
    updateDayTasks,
    updateDayReflection,
    resetApp,
  } = useAppData();

  // Check if cookies are enabled on mount
  useEffect(() => {
    setCookiesEnabled(areCookiesEnabled());
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback((data: {
    quote: string;
    skill: string;
    distraction: string;
    startDate: string;
  }) => {
    const success = saveUserData(data);
    if (!success) {
      alert('Failed to save your data. Please check if cookies are enabled.');
    }
  }, [saveUserData]);

  // Show loading while checking cookies
  if (cookiesEnabled === null || isLoading) {
    return <LoadingScreen />;
  }

  // Show warning if cookies are disabled
  if (!cookiesEnabled) {
    return <CookieWarning />;
  }

  // Show onboarding if user hasn't completed it
  if (!userData?.onboarded) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Show victory screen if challenge is complete
  if (isComplete) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <VictoryScreen
            userData={userData}
            getDayData={getDayData}
            onReset={resetApp}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Show dashboard for active challenge
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <DashboardScreen
          userData={userData}
          currentDay={currentDay}
          getDayData={getDayData}
          onTaskChange={updateDayTasks}
          onReflectionChange={updateDayReflection}
          onReset={resetApp}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
