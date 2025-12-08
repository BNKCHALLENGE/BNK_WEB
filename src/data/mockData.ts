import { Mission, Category, TabItem, User, AttendanceInfo, CategoryType } from '@/types/mission';

// 현재 사용자 더미 데이터
export const mockUser: User = {
  id: 'user-1',
  name: '채수원',
  profileImageUrl: '/profile-placeholder.png',
  coinBalance: 28146,
  preferences: {
    categories: ['food', 'cafe', 'tourist'],
    isOnboardingComplete: false,
  },
  acceptanceRate: 0.75,
  activeTimeSlot: 'afternoon',
};

// 탭 네비게이션 더미 데이터
export const mockTabs: TabItem[] = [
  { id: 'tab-1', name: '홈', isActive: true },
  { id: 'tab-2', name: '챌린지', isActive: false, hasNotification: true },
  { id: 'tab-3', name: '금융자산', isActive: false },
  { id: 'tab-4', name: '상품가입', isActive: false },
  { id: 'tab-5', name: '모아보기', isActive: false },
];

// 카테고리 더미 데이터 (백엔드와 동일)
export const mockCategories: Category[] = [
  { id: 'cat-all', name: 'all', isActive: true },
  { id: 'cat-food', name: 'food', isActive: false },
  { id: 'cat-cafe', name: 'cafe', isActive: false },
  { id: 'cat-tour', name: 'tour', isActive: false },
  { id: 'cat-culture', name: 'culture', isActive: false },
  { id: 'cat-festival', name: 'festival', isActive: false },
  { id: 'cat-walk', name: 'walk', isActive: false },
  { id: 'cat-shopping', name: 'shopping', isActive: false },
  { id: 'cat-study', name: 'study', isActive: false },
  { id: 'cat-sports', name: 'sports', isActive: false },
];

// 출석 체크 더미 데이터
export const mockAttendance: AttendanceInfo = {
  records: [
    { date: '2025-12-01', attended: true },
    { date: '2025-12-02', attended: true },
    { date: '2025-12-03', attended: true },
    { date: '2025-12-04', attended: true },
    { date: '2025-12-05', attended: true },
    { date: '2025-12-06', attended: true },
    { date: '2025-12-07', attended: true },
  ],
  consecutiveDays: 7,
  totalDays: 15,
};

// 진행중인 미션 더미 데이터
export const mockInProgressMissions: Mission[] = [
  {
    id: 'mission-10',
    title: '부산 현대미술관 방문하기',
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop',
    location: '부산 해운대구',
    locationDetail: '부산현대미술관',
    distance: '1km',
    coinReward: 500,
    category: 'culture' as CategoryType,
    isLiked: true,
    participationStatus: 'in_progress',
    endDate: '2025.12.15',
    coordinates: { lat: 35.1631, lng: 129.1636 },
  },
  {
    id: 'mission-11',
    title: '해운대 맛집 탐방',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    location: '부산 해운대구',
    locationDetail: '해운대 맛집거리',
    distance: '2.5km',
    coinReward: 300,
    category: 'food' as CategoryType,
    isLiked: false,
    participationStatus: 'in_progress',
    endDate: '2025.12.20',
    coordinates: { lat: 35.1586, lng: 129.1603 },
  },
];

// AI 추천 미션 더미 데이터
export const mockAIRecommendedMissions: Mission[] = [
  {
    id: 'mission-1',
    title: '송도 케이블카 타기',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    location: '부산 서구',
    locationDetail: '송도해상케이블카',
    distance: '18km',
    coinReward: 100,
    category: 'tour' as CategoryType,
    isLiked: false,
    endDate: '2025.12.15',
    insight: '최근 해당 챌린지에 대한 시민 관심도 65%가 증가했습니다.',
    verificationMethods: [
      '위치 기반 인증 또는 현장 QR 코드 스캔',
      '난이도별 배지 (예: 동백 새싹 배지) 지급'
    ],
    coordinates: { lat: 35.0686, lng: 129.0208 },
  },
  {
    id: 'mission-2',
    title: '롯데월드 어드벤처 부산',
    imageUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&h=300&fit=crop',
    location: '부산 기장군',
    locationDetail: '롯데월드 어드벤처 부산',
    distance: '12km',
    coinReward: 200,
    category: 'tour' as CategoryType,
    isLiked: false,
    endDate: '2025.12.31',
    insight: '가족 단위 방문객이 최근 한 달간 45% 증가했습니다.',
    verificationMethods: [
      '위치 기반 인증 또는 현장 QR 코드 스캔',
      '입장권 인증샷 업로드',
      '난이도별 배지 지급'
    ],
    coordinates: { lat: 35.1963, lng: 129.2133 },
  },
  {
    id: 'mission-7',
    title: '감천문화마을 탐방',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    location: '부산 사하구',
    locationDetail: '감천문화마을',
    distance: '15km',
    coinReward: 120,
    category: 'tour' as CategoryType,
    isLiked: true,
    endDate: '2025.12.20',
    insight: '외국인 관광객 방문율이 30% 증가했습니다.',
    verificationMethods: [
      '위치 기반 인증',
      '포토존 인증샷 업로드'
    ],
    coordinates: { lat: 35.0975, lng: 129.0108 },
  },
  {
    id: 'mission-8',
    title: '자갈치시장 먹거리 투어',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    location: '부산 중구',
    locationDetail: '자갈치시장',
    distance: '10km',
    coinReward: 80,
    category: 'food' as CategoryType,
    isLiked: false,
    endDate: '2025.11.30',
    insight: '주말 방문객이 평일 대비 200% 증가합니다.',
    verificationMethods: [
      '위치 기반 인증',
      '영수증 인증'
    ],
    coordinates: { lat: 35.0967, lng: 129.0305 },
  },
  {
    id: 'mission-9',
    title: '해동용궁사 방문',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=400&h=300&fit=crop',
    location: '부산 기장군',
    locationDetail: '해동용궁사',
    distance: '20km',
    coinReward: 150,
    category: 'tour' as CategoryType,
    isLiked: false,
    endDate: '2025.12.25',
    insight: '일출 명소로 새해 방문객이 급증합니다.',
    verificationMethods: [
      '위치 기반 인증 또는 현장 QR 코드 스캔',
      '난이도별 배지 지급'
    ],
    coordinates: { lat: 35.1884, lng: 129.2231 },
  },
];

// 전체 미션 리스트 더미 데이터
export const mockAllMissions: Mission[] = [
  {
    id: 'mission-3',
    title: '롯데 자이언츠 야구 직관 가기',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    location: '부산 동래구',
    locationDetail: '사직야구장',
    distance: '4.8km',
    coinReward: 200,
    category: 'sports' as CategoryType,
    isLiked: false,
    endDate: '2025.10.31',
    insight: '야구 시즌 기간 중 참여율이 120% 상승했습니다.',
    verificationMethods: [
      '위치 기반 인증 또는 현장 QR 코드 스캔',
      '경기 티켓 인증',
      '난이도별 배지 (예: 동백 새싹 배지) 지급'
    ],
    coordinates: { lat: 35.1939, lng: 129.0615 },
  },
  {
    id: 'mission-4',
    title: '해운대 해수욕장 방문하기',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    location: '부산 해운대구',
    locationDetail: '해운대 해수욕장',
    distance: '8.2km',
    coinReward: 150,
    category: 'tour' as CategoryType,
    isLiked: true,
    endDate: '2025.12.20',
    insight: '여름철 인기 미션 TOP 3에 선정되었습니다.',
    verificationMethods: [
      '위치 기반 인증',
      '해변 인증샷 업로드'
    ],
    coordinates: { lat: 35.1586, lng: 129.1603 },
  },
  {
    id: 'mission-5',
    title: '광안리 맛집 탐방',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    location: '부산 수영구',
    locationDetail: '광안리 해변로',
    distance: '6.5km',
    coinReward: 80,
    category: 'food' as CategoryType,
    isLiked: false,
    endDate: '2025.11.30',
    insight: '미식 카테고리에서 가장 많은 참여를 기록했습니다.',
    verificationMethods: [
      '맛집 영수증 인증',
      '음식 사진 업로드'
    ],
    coordinates: { lat: 35.1531, lng: 129.1186 },
  },
  {
    id: 'mission-6',
    title: '광안리 불꽃축제 챌린지',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    location: '부산 수영구',
    locationDetail: '광안리 해수욕장',
    distance: '6.8km',
    coinReward: 500,
    category: 'festival' as CategoryType,
    isLiked: false,
    endDate: '2025.11.30',
    insight: '최근 해당 챌린지에 대한 시민 관심도 80%가 증가했습니다.',
    verificationMethods: [
      '위치 기반 인증 또는 현장 QR 코드 스캔',
      '난이도별 배지 (예: 동백 새싹 배지) 지급'
    ],
    coordinates: { lat: 35.1531, lng: 129.1186 },
  },
  {
    id: 'mission-12',
    title: '태종대 유원지 트레킹',
    imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop',
    location: '부산 영도구',
    locationDetail: '태종대 유원지',
    distance: '14km',
    coinReward: 180,
    category: 'walk' as CategoryType,
    isLiked: false,
    endDate: '2025.12.15',
    insight: '가을철 단풍 시즌에 방문객이 150% 증가합니다.',
    verificationMethods: [
      '위치 기반 인증',
      '트레킹 코스 완주 인증'
    ],
    coordinates: { lat: 35.0519, lng: 129.0847 },
  },
  {
    id: 'mission-13',
    title: 'BIFF 광장 영화 관람',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    location: '부산 중구',
    locationDetail: 'BIFF 광장',
    distance: '9.5km',
    coinReward: 100,
    category: 'culture' as CategoryType,
    isLiked: true,
    endDate: '2025.11.20',
    insight: '영화제 기간 중 참여율이 300% 상승합니다.',
    verificationMethods: [
      '영화 티켓 인증',
      '위치 기반 인증'
    ],
    coordinates: { lat: 35.0987, lng: 129.0256 },
  },
];
