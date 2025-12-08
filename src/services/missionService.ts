import { Mission, Category, TabItem, User, CategoryType, SortType, AttendanceInfo } from '@/types/mission';
import { 
  mockUser, 
  mockTabs, 
  mockCategories, 
  mockAIRecommendedMissions, 
  mockAllMissions,
  mockAttendance,
  mockInProgressMissions
} from '@/data/mockData';

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bnk-api.up.railway.app/v1';

// 기본 위치 (부산)
const DEFAULT_LAT = 35.1796;
const DEFAULT_LON = 129.0756;

// 인증 헤더
const getAuthHeaders = () => ({
  'Authorization': 'Bearer user-1',
  'Content-Type': 'application/json',
});

// API 응답에서 안전하게 배열 추출
function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    // { missions: [...] } 형태 처리
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.missions)) {
      return obj.missions as T[];
    }
    if (Array.isArray(obj.data)) {
      return obj.data as T[];
    }
  }
  return [];
}

// 현재 사용자 정보 조회
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch user');
    
    const result = await response.json();
    // result.data 또는 result 자체가 user일 수 있음
    const userData = result.data || result;
    
    return {
      ...mockUser,
      ...userData,
      coinBalance: userData.coinBalance ?? mockUser.coinBalance,
    };
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockUser;
  }
}

// 탭 목록 조회
export async function getTabs(): Promise<TabItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tabs`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch tabs');
    
    const result = await response.json();
    const tabs = extractArray<TabItem>(result.data || result);
    
    return tabs.length > 0 ? tabs : mockTabs;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockTabs;
  }
}

// 카테고리 목록 조회 - 프론트엔드 고정 카테고리 사용
export async function getCategories(): Promise<Category[]> {
  // API 대신 프론트엔드에서 정의한 고정 카테고리 사용
  // 카테고리: all, food, cafe, tourist, culture, festival, walk, shopping, self-dev, sports
  return mockCategories;
}

// AI 추천 미션 목록 조회
export async function getAIRecommendedMissions(lat?: number, lon?: number, limit?: number): Promise<Mission[]> {
  try {
    // lat, lon이 없으면 기본값 사용 (API가 필수로 요구)
    const params = new URLSearchParams();
    params.append('lat', (lat ?? DEFAULT_LAT).toString());
    params.append('lon', (lon ?? DEFAULT_LON).toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/missions/ai-recommend?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch AI recommended missions');
    
    const result = await response.json();
    const missions = extractArray<Mission>(result.data || result);
    
    return missions.length > 0 ? missions : mockAIRecommendedMissions;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockAIRecommendedMissions;
  }
}

// 전체 미션 목록 조회
export async function getAllMissions(
  category?: CategoryType,
  sort?: SortType,
  page?: number,
  limit?: number,
  lat?: number,
  lon?: number
): Promise<Mission[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    // 위치 정보 추가 (거리 계산용)
    params.append('lat', (lat ?? DEFAULT_LAT).toString());
    params.append('lon', (lon ?? DEFAULT_LON).toString());
    
    const response = await fetch(`${API_BASE_URL}/missions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch missions');
    
    const result = await response.json();
    const missions = extractArray<Mission>(result.data || result);
    
    return missions.length > 0 ? missions : mockAllMissions;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    
    let missions = [...mockAllMissions];
    
    // 카테고리 필터링
    if (category && category !== 'all') {
      missions = missions.filter(m => m.category === category);
    }
    
    // 정렬
    if (sort === 'distance') {
      missions.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    
    return missions;
  }
}

// 진행중인 미션 목록 조회
export async function getInProgressMissions(lat?: number, lon?: number): Promise<Mission[]> {
  try {
    const params = new URLSearchParams();
    params.append('participationStatus', 'in_progress');
    // 위치 정보 추가 (거리 계산용)
    params.append('lat', (lat ?? DEFAULT_LAT).toString());
    params.append('lon', (lon ?? DEFAULT_LON).toString());
    
    const response = await fetch(`${API_BASE_URL}/missions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch in-progress missions');
    
    const result = await response.json();
    const missions = extractArray<Mission>(result.data || result);
    
    return missions;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockInProgressMissions;
  }
}

// 미션 상세 조회
export async function getMissionDetail(missionId: string): Promise<Mission | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${missionId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch mission detail');
    
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockAllMissions.find(m => m.id === missionId) || 
           mockAIRecommendedMissions.find(m => m.id === missionId) || 
           null;
  }
}

// 미션 좋아요 토글
export async function toggleMissionLike(missionId: string): Promise<{ isLiked: boolean; likeCount: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${missionId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to toggle like');
    
    const result = await response.json();
    return result.data || { isLiked: true, likeCount: 0 };
  } catch (error) {
    console.warn('API 호출 실패:', error);
    return { isLiked: true, likeCount: 0 };
  }
}

// 미션 참여하기
export async function participateMission(missionId: string): Promise<{ success: boolean; message: string; participationId?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${missionId}/participate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorResult = await response.json();
      return { 
        success: false, 
        message: errorResult.error?.message || '미션 참여에 실패했습니다.' 
      };
    }
    
    const result = await response.json();
    const data = result.data || result;
    return { 
      success: true, 
      message: '미션 참여가 완료되었습니다!',
      participationId: data.participationId
    };
  } catch (error) {
    console.warn('API 호출 실패:', error);
    return { 
      success: true, 
      message: '미션 참여가 완료되었습니다!' 
    };
  }
}

// 미션 완료
export async function completeMission(missionId: string, success: boolean): Promise<{ success: boolean; reward?: number; coinBalance?: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${missionId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ success }),
    });
    
    if (!response.ok) throw new Error('Failed to complete mission');
    
    const result = await response.json();
    const data = result.data || result;
    return { 
      success: true, 
      reward: data.reward,
      coinBalance: data.coinBalance
    };
  } catch (error) {
    console.warn('API 호출 실패:', error);
    return { success: true };
  }
}

// 사용자 선호도 저장
export async function saveUserPreferences(categories: CategoryType[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/preferences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ categories }),
    });
    
    if (!response.ok) throw new Error('Failed to save preferences');
    
    return true;
  } catch (error) {
    console.warn('API 호출 실패:', error);
    return true; // 더미에서는 항상 성공
  }
}

// 사용자 선호도 조회
export async function getUserPreferences(): Promise<{ categories: CategoryType[]; isOnboardingComplete: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/preferences`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to get preferences');
    
    const result = await response.json();
    return result.data || { categories: [], isOnboardingComplete: false };
  } catch (error) {
    console.warn('API 호출 실패:', error);
    return { categories: [], isOnboardingComplete: false };
  }
}

// 출석 정보 조회 (더미)
export async function getAttendanceInfo(): Promise<AttendanceInfo> {
  // TODO: 실제 API 연동 시 구현
  return Promise.resolve(mockAttendance);
}

// 출석 체크 (더미)
export async function checkIn(): Promise<boolean> {
  // TODO: 실제 API 연동 시 구현
  return Promise.resolve(true);
}
