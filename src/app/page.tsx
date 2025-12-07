'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import HomeScreen from '@/components/HomeScreen';
import CategoryFilter from '@/components/CategoryFilter';
import AIRecommendSection from '@/components/AIRecommendSection';
import MissionList from '@/components/MissionList';
import MissionDetail from '@/components/MissionDetail';
import OnboardingPreference from '@/components/OnboardingPreference';
import CoinCard from '@/components/CoinCard';
import InProgressSection from '@/components/InProgressSection';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import MissionTrackingOverlay from '@/components/MissionTrackingOverlay';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useMissionTracking } from '@/hooks/useMissionTracking';
import { 
  getCurrentUser, 
  getTabs, 
  getCategories, 
  getAIRecommendedMissions, 
  getAllMissions,
  getInProgressMissions,
  getAttendanceInfo,
  toggleMissionLike,
  participateMission,
  saveUserPreferences,
  checkIn
} from '@/services/missionService';
import { Mission, Category, TabItem, User, CategoryType, SortType, AttendanceInfo } from '@/types/mission';

export default function Home() {
  // 온보딩 상태
  const { isOnboardingComplete, completeOnboarding, skipOnboarding } = useOnboarding();

  // 현재 활성 탭
  const [activeTab, setActiveTab] = useState<string>('tab-1'); // 홈이 기본

  // 상태 관리
  const [user, setUser] = useState<User | null>(null);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [aiMissions, setAiMissions] = useState<Mission[]>([]);
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [inProgressMissions, setInProgressMissions] = useState<Mission[]>([]);
  const [attendanceInfo, setAttendanceInfo] = useState<AttendanceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trackingMission, setTrackingMission] = useState<Mission | null>(null);

  // 미션 완료 콜백
  const handleMissionComplete = useCallback(async (data: { missionId: string; reward?: number; coinBalance?: number }) => {
    console.log('Mission completed:', data);
    
    // 사용자 코인 잔액 업데이트
    if (data.coinBalance && user) {
      setUser(prev => prev ? { ...prev, coinBalance: data.coinBalance! } : null);
    }
    
    // 추적 중인 미션 초기화
    setTrackingMission(null);
    
    // 진행중 미션 목록 새로고침
    const inProgressData = await getInProgressMissions();
    setInProgressMissions(inProgressData);
    
    // 성공 알림
    alert(`🎉 미션 완료! ${data.reward || 0}코인을 획득했습니다!`);
  }, [user]);

  // 미션 추적 훅
  const { isTracking, progress, startTracking, stopTracking } = useMissionTracking(handleMissionComplete);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [userData, tabsData] = await Promise.all([
          getCurrentUser(),
          getTabs(),
        ]);
        
        setUser(userData);
        
        // 초기 탭 상태 설정 - 홈(tab-1)을 활성화
        const initialTabs = tabsData.map(tab => ({
          ...tab,
          isActive: tab.id === 'tab-1' // 홈 탭 활성화
        }));
        setTabs(initialTabs);
        setActiveTab('tab-1');
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 푸시 알림 이벤트 리스너
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePushNotification = (event: CustomEvent) => {
      console.log('Push notification received:', event.detail);
      // 알림 처리 로직 (예: 토스트 메시지 표시)
    };

    window.addEventListener('pushNotification', handlePushNotification as EventListener);

    return () => {
      window.removeEventListener('pushNotification', handlePushNotification as EventListener);
    };
  }, []);

  // 챌린지 탭 데이터 로드
  const loadChallengeData = async () => {
    if (!user) return;
    
    try {
      const [categoriesData, aiMissionsData, allMissionsData, inProgressData, attendanceData] = await Promise.all([
        getCategories(),
        getAIRecommendedMissions(),
        getAllMissions(),
        getInProgressMissions(),
        getAttendanceInfo(),
      ]);
      
      setCategories(categoriesData);
      setAiMissions(aiMissionsData);
      setAllMissions(allMissionsData);
      setInProgressMissions(inProgressData);
      setAttendanceInfo(attendanceData);
    } catch (error) {
      console.error('챌린지 데이터 로드 실패:', error);
    }
  };

  // 탭 변경 핸들러
  const handleTabClick = (tabId: string) => {
    const newTabs = tabs.map(t => ({
      ...t,
      isActive: t.id === tabId
    }));
    setTabs(newTabs);
    setActiveTab(tabId);

    // 챌린지 탭 클릭 시
    if (tabId === 'tab-2') {
      // 온보딩이 완료되지 않았으면 온보딩 표시
      if (!isOnboardingComplete) {
        setShowOnboarding(true);
      } else {
        // 데이터 로드
        loadChallengeData();
      }
    }
  };

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

      // 진행중 미션 업데이트
      setInProgressMissions(prev => 
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

  // 미션 클릭 핸들러
  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedMission(null);
  };

  // 미션 참여 핸들러 - 위치 추적 시작
  const handleParticipateClick = async (missionId: string) => {
    const mission = selectedMission || 
      allMissions.find(m => m.id === missionId) ||
      aiMissions.find(m => m.id === missionId);

    if (!mission) {
      alert('미션 정보를 찾을 수 없습니다.');
      return;
    }

    if (!mission.coordinates) {
      alert('미션 위치 정보가 없습니다.');
      return;
    }

    try {
      // 먼저 API로 미션 참여 등록
      const result = await participateMission(missionId);
      
      if (result.success) {
        // 상세 페이지 닫기
        setSelectedMission(null);
        
        // 위치 추적 시작
        setTrackingMission(mission);
        startTracking(mission);
        
        // 진행중 미션 새로고침
        const inProgressData = await getInProgressMissions();
        setInProgressMissions(inProgressData);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('미션 참여 실패:', error);
      alert('미션 참여 중 오류가 발생했습니다.');
    }
  };

  // 미션 추적 취소 핸들러
  const handleCancelTracking = () => {
    stopTracking();
    setTrackingMission(null);
  };

  // 온보딩 완료 핸들러
  const handleOnboardingComplete = async (selectedCategories: CategoryType[]) => {
    await saveUserPreferences(selectedCategories);
    completeOnboarding(selectedCategories);
    setShowOnboarding(false);
    // 데이터 로드
    loadChallengeData();
  };

  // 온보딩 스킵 핸들러
  const handleOnboardingSkip = () => {
    skipOnboarding();
    setShowOnboarding(false);
    // 데이터 로드
    loadChallengeData();
  };

  // 출석 체크 핸들러
  const handleCheckIn = async () => {
    try {
      await checkIn();
      alert('출석체크 완료! 🎉');
      // 출석 정보 새로고침
      const attendanceData = await getAttendanceInfo();
      setAttendanceInfo(attendanceData);
    } catch (error) {
      console.error('출석체크 실패:', error);
    }
  };

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

  // 온보딩 화면
  if (showOnboarding) {
    return (
      <OnboardingPreference 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // 미션 상세 페이지
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

  // 현재 활성 탭 확인
  const isHomeTab = activeTab === 'tab-1';
  const isChallengeTab = activeTab === 'tab-2';

  return (
    <div className="min-h-screen bg-gray-50 overscroll-bounce">
      {/* 헤더 */}
      <Header user={user} />
      
      {/* 탭 네비게이션 */}
      <TabNavigation tabs={tabs} onTabClick={handleTabClick} />
      
      {/* 홈 탭 */}
      {isHomeTab && (
        <HomeScreen user={user} />
      )}

      {/* 챌린지 탭 */}
      {isChallengeTab && (
        <>
          {/* 코인 카드 */}
          <CoinCard coinBalance={user.coinBalance} />

          {/* 진행중인 챌린지 */}
          <InProgressSection 
            missions={inProgressMissions}
            onMissionClick={handleMissionClick}
          />
          
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

          {/* 출석 체크 달력 */}
          {attendanceInfo && (
            <AttendanceCalendar 
              attendanceInfo={attendanceInfo}
              onCheckIn={handleCheckIn}
            />
          )}
          
          {/* 하단 여백 */}
          <div className="h-8 bg-gray-100" />
        </>
      )}

      {/* 다른 탭들 (더미) */}
      {!isHomeTab && !isChallengeTab && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <p className="text-gray-500 font-medium">준비 중입니다</p>
          </div>
        </div>
      )}

      {/* 미션 추적 오버레이 */}
      {isTracking && trackingMission && (
        <MissionTrackingOverlay
          mission={trackingMission}
          progress={progress}
          onCancel={handleCancelTracking}
        />
      )}
    </div>
  );
}
