// 미션 관련 타입 정의

export interface Mission {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  locationDetail?: string; // 상세 장소
  distance: string;
  coinReward: number;
  category: CategoryType;
  isLiked?: boolean;
  endDate?: string; // 마감일
  insight?: string; // 인사이트 메시지
  verificationMethods?: string[]; // 인증 방식
  mapImageUrl?: string; // 지도 이미지 URL
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type CategoryType = 
  | '전체'
  | '음식카페'
  | '관광명소'
  | '문화생활'
  | '축제행사';

export interface Category {
  id: string;
  name: CategoryType;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export type SortType = '거리순' | '인기순' | '최신순';

export interface TabItem {
  id: string;
  name: string;
  isActive: boolean;
  hasNotification?: boolean;
}
