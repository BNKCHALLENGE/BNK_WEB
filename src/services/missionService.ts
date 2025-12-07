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

// 인증 헤더
const getAuthHeaders = () => ({
  'Authorization': 'Bearer user-1',
  'Content-Type': 'application/json',
});

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// 현재 사용자 정보 조회
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch user');
    
    const result: ApiResponse<User> = await response.json();
    return result.data;
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
    
    const result: ApiResponse<TabItem[]> = await response.json();
    return result.data;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockTabs;
  }
}

// 카테고리 목록 조회
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch categories');
    
    const result: ApiResponse<Category[]> = await response.json();
    return result.data;
  } catch (error) {
    console.warn('API 호출 실패, 더미 데이터 사용:', error);
    return mockCategories;
  }
}

// AI 추천 미션 목록 조회
export async function getAIRecommendedMissions(lat?: number, lon?: number, limit?: number): Promise<Mission[]> {
  try {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/missions/ai-recommend?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch AI recommended missions');
    
    const result: ApiResponse<Mission[]> = await response.json();
    return result.data;
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
  limit?: number
): Promise<Mission[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/missions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch missions');
    
    const result: ApiResponse<{ missions: Mission[] }> = await response.json();
    return result.data.missions || result.data as unknown as Mission[];
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
export async function getInProgressMissions(): Promise<Mission[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/missions?status=in_progress`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch in-progress missions');
    
    const result: ApiResponse<Mission[]> = await response.json();
    return result.data;
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
    
    const result: ApiResponse<Mission> = await response.json();
    return result.data;
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
    
    const result: ApiResponse<{ isLiked: boolean; likeCount: number }> = await response.json();
    return result.data;
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
    
    const result: ApiResponse<{ participationId: string; status: string; startedAt: string }> = await response.json();
    return { 
      success: true, 
      message: '미션 참여가 완료되었습니다!',
      participationId: result.data.participationId
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
    
    const result: ApiResponse<{ missionId: string; userId: string; status: string; reward: number; coinBalance: number }> = await response.json();
    return { 
      success: true, 
      reward: result.data.reward,
      coinBalance: result.data.coinBalance
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
    
    const result: ApiResponse<{ categories: CategoryType[]; isOnboardingComplete: boolean }> = await response.json();
    return result.data;
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
