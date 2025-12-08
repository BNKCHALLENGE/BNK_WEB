'use client';

import { useState } from 'react';
import { CategoryType } from '@/types/mission';

export function useOnboarding() {
  // 새로고침/새 접속 시 항상 온보딩 표시 (localStorage 저장 안함)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CategoryType[]>([]);

  const completeOnboarding = (selectedCategories: CategoryType[]) => {
    setIsOnboardingComplete(true);
    setPreferences(selectedCategories);
  };

  const skipOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
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
