import { Mission, Category, TabItem, User, CategoryType, SortType } from '@/types/mission';
import { 
  mockUser, 
  mockTabs, 
  mockCategories, 
  mockAIRecommendedMissions, 
  mockAllMissions 
} from '@/data/mockData';

// API 베이스 URL (나중에 실제 API 연동 시 환경변수로 관리)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 현재 사용자 정보 조회
export async function getCurrentUser(): Promise<User> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${API_BASE_URL}/api/user/me`);
  // if (!response.ok) throw new Error('Failed to fetch user');
  // return response.json();
  
  // 더미 데이터 반환
  return Promise.resolve(mockUser);
}

// 탭 목록 조회
export async function getTabs(): Promise<TabItem[]> {
  // TODO: 실제 API 연동 시 구현
  return Promise.resolve(mockTabs);
}

// 카테고리 목록 조회
export async function getCategories(): Promise<Category[]> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${API_BASE_URL}/api/categories`);
  // if (!response.ok) throw new Error('Failed to fetch categories');
  // return response.json();
  
  return Promise.resolve(mockCategories);
}

// AI 추천 미션 목록 조회
export async function getAIRecommendedMissions(userId: string): Promise<Mission[]> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${API_BASE_URL}/api/missions/ai-recommend?userId=${userId}`);
  // if (!response.ok) throw new Error('Failed to fetch AI recommended missions');
  // return response.json();
  
  return Promise.resolve(mockAIRecommendedMissions);
}

// 전체 미션 목록 조회
export async function getAllMissions(
  category?: CategoryType,
  sort?: SortType
): Promise<Mission[]> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const params = new URLSearchParams();
  // if (category && category !== '전체') params.append('category', category);
  // if (sort) params.append('sort', sort);
  // const response = await fetch(`${API_BASE_URL}/api/missions?${params.toString()}`);
  // if (!response.ok) throw new Error('Failed to fetch missions');
  // return response.json();
  
  let missions = [...mockAllMissions];
  
  // 카테고리 필터링
  if (category && category !== '전체') {
    missions = missions.filter(m => m.category === category);
  }
  
  // 정렬 (더미 구현)
  if (sort === '거리순') {
    missions.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }
  
  return Promise.resolve(missions);
}

// 미션 좋아요 토글
export async function toggleMissionLike(missionId: string): Promise<boolean> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/like`, {
  //   method: 'POST',
  // });
  // if (!response.ok) throw new Error('Failed to toggle like');
  // const data = await response.json();
  // return data.isLiked;
  
  // 더미 구현: 토글 성공 시뮬레이션
  return Promise.resolve(true);
}

// 미션 참여하기
export async function participateMission(missionId: string): Promise<{ success: boolean; message: string }> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/participate`, {
  //   method: 'POST',
  // });
  // if (!response.ok) throw new Error('Failed to participate mission');
  // return response.json();
  
  return Promise.resolve({ 
    success: true, 
    message: '미션 참여가 완료되었습니다!' 
  });
}

