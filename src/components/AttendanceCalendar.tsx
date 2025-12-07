'use client';

import { useState } from 'react';
import { AttendanceInfo } from '@/types/mission';

interface AttendanceCalendarProps {
  attendanceInfo: AttendanceInfo;
  onCheckIn?: () => void;
}

// 체크 아이콘
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// 불꽃 아이콘
const FireIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2c0 4-4 6-4 10a4 4 0 1 0 8 0c0-4-4-6-4-10z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5"/>
    <path d="M12 8c0 2-2 3-2 5a2 2 0 1 0 4 0c0-2-2-3-2-5z" fill="#FCD34D"/>
  </svg>
);

export default function AttendanceCalendar({ attendanceInfo, onCheckIn }: AttendanceCalendarProps) {
  const [currentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 해당 월의 첫째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 달력 시작 요일 (0: 일요일)
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // 출석 여부 확인 함수
  const isAttended = (day: number): boolean => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceInfo.records.some(r => r.date === dateStr && r.attended);
  };
  
  // 오늘인지 확인
  const isToday = (day: number): boolean => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };
  
  // 달력 그리드 생성
  const calendarDays: (number | null)[] = [];
  
  // 빈 칸 추가
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="bg-white mx-4 my-4 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-coral-500 to-rose-500 px-5 py-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">출석체크</h3>
            <p className="text-sm text-white/80 mt-0.5">
              {year}년 {monthNames[month]}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <FireIcon />
            <span className="font-bold">{attendanceInfo.consecutiveDays}일 연속</span>
          </div>
        </div>
      </div>

      {/* 달력 */}
      <div className="p-4">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-2 ${
                index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center rounded-full text-sm relative
                ${day === null ? '' : 'cursor-pointer'}
                ${isToday(day!) ? 'ring-2 ring-coral-500 ring-offset-1' : ''}
              `}
            >
              {day !== null && (
                <>
                  {isAttended(day) ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center text-white shadow-sm">
                      <CheckIcon />
                    </div>
                  ) : (
                    <span className={`
                      ${isToday(day) ? 'font-bold text-coral-600' : 'text-gray-600'}
                    `}>
                      {day}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* 출석 버튼 */}
        <button
          onClick={onCheckIn}
          className="w-full mt-4 py-3 bg-gradient-to-r from-coral-500 to-rose-500 text-white font-semibold rounded-xl shadow-md shadow-coral-500/20 hover:from-coral-600 hover:to-rose-600 active:scale-[0.98] transition-all"
        >
          오늘 출석하기
        </button>

        {/* 출석 정보 */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{attendanceInfo.consecutiveDays}</p>
            <p className="text-xs text-gray-500">연속 출석</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{attendanceInfo.totalDays}</p>
            <p className="text-xs text-gray-500">총 출석일</p>
          </div>
        </div>
      </div>
    </div>
  );
}

