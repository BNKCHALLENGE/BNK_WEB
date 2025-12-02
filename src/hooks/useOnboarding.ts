'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'bnk_challenge_onboarding_complete';
const PREFERENCES_KEY = 'bnk_challenge_preferences';

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {
    // localStorage에서 온보딩 완료 여부 확인
    const completed = localStorage.getItem(ONBOARDING_KEY);
    const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
    
    setIsOnboardingComplete(completed === 'true');
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const completeOnboarding = (selectedCategories: string[]) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(selectedCategories));
    setIsOnboardingComplete(true);
    setPreferences(selectedCategories);
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(PREFERENCES_KEY);
    setIsOnboardingComplete(false);
    setPreferences([]);
  };

  return {
    isOnboardingComplete,
    preferences,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}

