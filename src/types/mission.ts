// 미션 관련 타입 정의

export interface Mission {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  locationDetail?: string;
  distance: string;
  coinReward: number;
  category: CategoryType;
  isLiked?: boolean;
  endDate?: string;
  insight?: string;
  verificationMethods?: string[];
  mapImageUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  participationStatus?: 'in_progress' | 'completed' | null;
  completedAt?: string | null;
  modelProba?: number;
  finalScore?: number;
}

// API 카테고리 (백엔드 소문자)
export type CategoryType = 
  | 'all'
  | 'food'
  | 'cafe'
  | 'tourist'
  | 'culture'
  | 'festival'
  | 'walk'
  | 'shopping'
  | 'self-dev'
  | 'sports';

// 카테고리 한글 매핑
export const CategoryLabels: Record<CategoryType, string> = {
  'all': '전체',
  'food': '음식',
  'cafe': '카페',
  'tourist': '관광',
  'culture': '문화생활',
  'festival': '축제',
  'walk': '산책',
  'shopping': '쇼핑',
  'self-dev': '자기개발',
  'sports': '스포츠',
};

// 온보딩용 카테고리 (all 제외)
export const OnboardingCategories: { id: CategoryType; emoji: string; label: string }[] = [
  { id: 'food', emoji: '🍳', label: '음식' },
  { id: 'cafe', emoji: '☕', label: '카페' },
  { id: 'tourist', emoji: '🏖️', label: '관광' },
  { id: 'culture', emoji: '🎭', label: '문화생활' },
  { id: 'festival', emoji: '🎊', label: '축제' },
  { id: 'walk', emoji: '🚶', label: '산책' },
  { id: 'shopping', emoji: '🛍️', label: '쇼핑' },
  { id: 'self-dev', emoji: '📚', label: '자기개발' },
  { id: 'sports', emoji: '⚾', label: '스포츠' },
];

export interface Category {
  id: string;
  name: CategoryType;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  profileImageUrl?: string;
  gender?: string;
  age?: number;
  coinBalance: number;
  preferences?: {
    categories: CategoryType[];
    isOnboardingComplete: boolean;
  };
  acceptanceRate?: number;
  activeTimeSlot?: string;
}

export type SortType = 'distance' | 'popular' | 'recent';

export const SortLabels: Record<SortType, string> = {
  'distance': '거리순',
  'popular': '인기순',
  'recent': '최신순',
};

export interface TabItem {
  id: string;
  name: string;
  isActive: boolean;
  hasNotification?: boolean;
}

// 출석 체크
export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  attended: boolean;
}

export interface AttendanceInfo {
  records: AttendanceRecord[];
  consecutiveDays: number;
  totalDays: number;
}
