'use client';

import { useState, useEffect } from 'react';
import { CategoryType } from '@/types/mission';

const CHALLENGE_ONBOARDING_KEY = 'bnk_challenge_onboarding_complete';
const CHALLENGE_PREFERENCES_KEY = 'bnk_challenge_preferences';

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CategoryType[]>([]);

  useEffect(() => {
    // localStorage에서 온보딩 완료 여부 확인
    const completed = localStorage.getItem(CHALLENGE_ONBOARDING_KEY);
    const savedPreferences = localStorage.getItem(CHALLENGE_PREFERENCES_KEY);
    
    setIsOnboardingComplete(completed === 'true');
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const completeOnboarding = (selectedCategories: CategoryType[]) => {
    localStorage.setItem(CHALLENGE_ONBOARDING_KEY, 'true');
    localStorage.setItem(CHALLENGE_PREFERENCES_KEY, JSON.stringify(selectedCategories));
    setIsOnboardingComplete(true);
    setPreferences(selectedCategories);
  };

  const skipOnboarding = () => {
    localStorage.setItem(CHALLENGE_ONBOARDING_KEY, 'true');
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(CHALLENGE_ONBOARDING_KEY);
    localStorage.removeItem(CHALLENGE_PREFERENCES_KEY);
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
