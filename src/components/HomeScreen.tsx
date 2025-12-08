'use client';

import { User } from '@/types/mission';

interface HomeScreenProps {
  user: User;
}

// 카드 아이콘
const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

// 송금 아이콘
const TransferIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
  </svg>
);

// 이체 아이콘
const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M3 10h18M12 3l9 7H3l9-7zM5 10v11M9 10v11M15 10v11M19 10v11" />
  </svg>
);

// QR 아이콘
const QRIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export default function HomeScreen({ user }: HomeScreenProps) {
  const quickMenus = [
    { icon: <CardIcon />, label: '카드' },
    { icon: <TransferIcon />, label: '송금' },
    { icon: <BankIcon />, label: '이체' },
    { icon: <QRIcon />, label: 'QR결제' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 계좌 카드 */}
      <div className="bg-white px-4 py-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">BNK 입출금통장</p>
              <p className="text-xs text-blue-200">123-456-789012</p>
            </div>
            <button className="text-blue-100 text-sm">
              전체계좌 &gt;
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-3xl font-bold">
              {user.coinBalance.toLocaleString()}
              <span className="text-lg font-normal ml-1">원</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
              이체
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
              결제
            </button>
          </div>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="bg-white px-4 py-5 mt-2">
        <div className="grid grid-cols-4 gap-4">
          {quickMenus.map((menu, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                {menu.icon}
              </div>
              <span className="text-xs text-gray-700 font-medium">{menu.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 배너 */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-90 mb-1">이번 달 혜택</p>
          <p className="font-bold text-lg">최대 5% 캐시백 이벤트</p>
        </div>
      </div>

      {/* 추천 서비스 */}
      <div className="bg-white px-4 py-5 mt-2">
        <h3 className="font-bold text-gray-900 mb-4">{user.name}님을 위한 추천</h3>
        
        <div className="space-y-3">
          {[
            { title: '챌린지 참여하고 동백코인 받기', desc: '다양한 미션에 도전해보세요', emoji: '🎯' },
            { title: '적금 금리 UP 이벤트', desc: '최대 연 4.5% 금리 혜택', emoji: '💰' },
            { title: '신용카드 무이자 할부', desc: '최대 12개월 무이자', emoji: '💳' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                {item.emoji}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="h-20" />
    </div>
  );
}


