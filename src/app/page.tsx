'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import CategoryFilter from '@/components/CategoryFilter';
import AIRecommendSection from '@/components/AIRecommendSection';
import MissionList from '@/components/MissionList';
import MissionDetail from '@/components/MissionDetail';
import OnboardingPreference from '@/components/OnboardingPreference';
import { useOnboarding } from '@/hooks/useOnboarding';
import { 
  getCurrentUser, 
  getTabs, 
  getCategories, 
  getAIRecommendedMissions, 
  getAllMissions,
  toggleMissionLike,
  participateMission 
} from '@/services/missionService';
import { Mission, Category, TabItem, User, CategoryType, SortType } from '@/types/mission';

export default function Home() {
  // 온보딩 상태
  const { isOnboardingComplete, completeOnboarding, skipOnboarding } = useOnboarding();

  // 상태 관리
  const [user, setUser] = useState<User | null>(null);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('전체');
  const [aiMissions, setAiMissions] = useState<Mission[]>([]);
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    // 온보딩 완료 여부가 결정되기 전에는 로드하지 않음
    if (isOnboardingComplete === null) return;
    // 온보딩이 완료되지 않았으면 로드하지 않음
    if (!isOnboardingComplete) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [userData, tabsData, categoriesData] = await Promise.all([
          getCurrentUser(),
          getTabs(),
          getCategories(),
        ]);
        
        setUser(userData);
        setTabs(tabsData);
        setCategories(categoriesData);
        
        // 사용자 정보가 있으면 미션 데이터 로드
        if (userData) {
          const [aiMissionsData, allMissionsData] = await Promise.all([
            getAIRecommendedMissions(userData.id),
            getAllMissions(),
          ]);
          
          setAiMissions(aiMissionsData);
          setAllMissions(allMissionsData);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOnboardingComplete]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedCategory(category);
    
    try {
      const missions = await getAllMissions(category);
      setAllMissions(missions);
    } catch (error) {
      console.error('미션 목록 로드 실패:', error);
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = async (sort: SortType) => {
    try {
      const missions = await getAllMissions(selectedCategory, sort);
      setAllMissions(missions);
    } catch (error) {
      console.error('미션 목록 정렬 실패:', error);
    }
  };

  // 좋아요 토글 핸들러
  const handleLikeClick = async (missionId: string) => {
    try {
      await toggleMissionLike(missionId);
      
      // AI 추천 미션 업데이트
      setAiMissions(prev => 
        prev.map(m => 
          m.id === missionId ? { ...m, isLiked: !m.isLiked } : m
        )
      );
      
      // 전체 미션 업데이트
      setAllMissions(prev => 
        prev.map(m => 
          m.id === missionId ? { ...m, isLiked: !m.isLiked } : m
        )
      );

      // 선택된 미션도 업데이트
      if (selectedMission?.id === missionId) {
        setSelectedMission(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  // 미션 클릭 핸들러 (상세 페이지로 이동)
  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedMission(null);
  };

  // 미션 참여 핸들러
  const handleParticipateClick = async (missionId: string) => {
    try {
      const result = await participateMission(missionId);
      if (result.success) {
        alert(result.message);
        setSelectedMission(null); // 참여 후 목록으로 돌아가기
      }
    } catch (error) {
      console.error('미션 참여 실패:', error);
    }
  };

  // 온보딩 완료 핸들러
  const handleOnboardingComplete = (selectedCategories: string[]) => {
    completeOnboarding(selectedCategories);
  };

  // 온보딩 스킵 핸들러
  const handleOnboardingSkip = () => {
    skipOnboarding();
  };

  // 온보딩 상태 확인 중
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-coral-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // 온보딩 화면
  if (!isOnboardingComplete) {
    return (
      <OnboardingPreference 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-coral-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😢</span>
          </div>
          <p className="text-gray-600 font-medium">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // 미션 상세 페이지가 선택된 경우
  if (selectedMission) {
    return (
      <MissionDetail
        mission={selectedMission}
        onBack={handleBack}
        onLikeClick={handleLikeClick}
        onParticipate={handleParticipateClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overscroll-bounce">
      {/* 헤더 */}
      <Header user={user} />
      
      {/* 탭 네비게이션 */}
      <TabNavigation tabs={tabs} />
      
      {/* 카테고리 필터 */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* AI 추천 미션 섹션 */}
      <AIRecommendSection 
        user={user}
        missions={aiMissions}
        onLikeClick={handleLikeClick}
        onMissionClick={handleMissionClick}
      />
      
      {/* 구분선 */}
      <div className="h-3 bg-gradient-to-b from-gray-100 to-gray-50" />
      
      {/* 미션 리스트 (세로 스크롤) */}
      <MissionList 
        missions={allMissions}
        onLikeClick={handleLikeClick}
        onMissionClick={handleMissionClick}
        onSortChange={handleSortChange}
      />
      
      {/* 하단 여백 */}
      <div className="h-8 bg-gray-100" />
    </div>
  );
}
