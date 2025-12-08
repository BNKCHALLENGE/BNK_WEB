'use client';

import { useState } from 'react';

const API_BASE_URL = 'https://bnk-api.up.railway.app/v1';
const AUTH_TOKEN = 'Bearer user-1';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default function AdminPage() {
  // 개별 알림 전송
  const [singleToken, setSingleToken] = useState('');
  const [singleTitle, setSingleTitle] = useState('🎉 챌린지 알림');
  const [singleBody, setSingleBody] = useState('새로운 미션이 도착했습니다!');
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<ApiResponse | null>(null);

  // 전체 알림 전송
  const [broadcastTitle, setBroadcastTitle] = useState('📢 전체 공지');
  const [broadcastBody, setBroadcastBody] = useState('새로운 챌린지가 시작되었습니다!');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<ApiResponse | null>(null);

  // 개별 알림 전송
  const sendSingleNotification = async () => {
    if (!singleToken.trim()) {
      alert('FCM 토큰을 입력해주세요.');
      return;
    }

    setSingleLoading(true);
    setSingleResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: singleToken.trim(),
          title: singleTitle,
          body: singleBody,
        }),
      });

      const data = await response.json();
      setSingleResult({
        success: response.ok,
        data: data,
        error: response.ok ? undefined : data.message || '전송 실패',
      });
    } catch (error) {
      setSingleResult({
        success: false,
        error: (error as Error).message,
      });
    } finally {
      setSingleLoading(false);
    }
  };

  // 전체 알림 전송
  const sendBroadcastNotification = async () => {
    if (!confirm('전체 사용자에게 알림을 전송하시겠습니까?')) {
      return;
    }

    setBroadcastLoading(true);
    setBroadcastResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/broadcast-challenge`, {
        method: 'POST',
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: broadcastTitle,
          body: broadcastBody,
        }),
      });

      const data = await response.json();
      setBroadcastResult({
        success: response.ok,
        data: data,
        error: response.ok ? undefined : data.message || '전송 실패',
      });
    } catch (error) {
      setBroadcastResult({
        success: false,
        error: (error as Error).message,
      });
    } finally {
      setBroadcastLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">🔔 BNK 알림 관리자</h1>
          <p className="text-gray-400">FCM 푸시 알림 테스트 및 전송</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 개별 알림 전송 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">1</span>
              개별 알림 전송
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">FCM 토큰 *</label>
                <textarea
                  value={singleToken}
                  onChange={(e) => setSingleToken(e.target.value)}
                  placeholder="FCM 토큰을 붙여넣으세요..."
                  className="w-full bg-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">제목</label>
                <input
                  type="text"
                  value={singleTitle}
                  onChange={(e) => setSingleTitle(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-sm text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">내용</label>
                <textarea
                  value={singleBody}
                  onChange={(e) => setSingleBody(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-sm text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={sendSingleNotification}
                disabled={singleLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                {singleLoading ? '전송 중...' : '📤 알림 전송'}
              </button>

              {/* 결과 표시 */}
              {singleResult && (
                <div className={`p-4 rounded-lg ${singleResult.success ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
                  <p className={`text-sm font-medium ${singleResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {singleResult.success ? '✅ 전송 성공' : '❌ 전송 실패'}
                  </p>
                  <pre className="mt-2 text-xs text-gray-300 overflow-auto">
                    {JSON.stringify(singleResult.data || singleResult.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 전체 알림 전송 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm">2</span>
              전체 알림 전송
            </h2>

            <div className="space-y-4">
              <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 mb-4">
                <p className="text-orange-400 text-sm">
                  ⚠️ 등록된 모든 사용자에게 알림이 전송됩니다.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">제목</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-sm text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">내용</label>
                <textarea
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-3 text-sm text-white border border-gray-600 focus:border-orange-500 focus:outline-none resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={sendBroadcastNotification}
                disabled={broadcastLoading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                {broadcastLoading ? '전송 중...' : '📢 전체 알림 전송'}
              </button>

              {/* 결과 표시 */}
              {broadcastResult && (
                <div className={`p-4 rounded-lg ${broadcastResult.success ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
                  <p className={`text-sm font-medium ${broadcastResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {broadcastResult.success ? '✅ 전송 성공' : '❌ 전송 실패'}
                  </p>
                  <pre className="mt-2 text-xs text-gray-300 overflow-auto">
                    {JSON.stringify(broadcastResult.data || broadcastResult.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API 정보 */}
        <div className="mt-10 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">📡 API 엔드포인트</h2>
          
          <div className="space-y-4 text-sm">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-blue-400 font-mono mb-2">POST /v1/notifications/send</p>
              <p className="text-gray-400">개별 FCM 토큰으로 알림 전송</p>
              <pre className="mt-2 text-xs text-gray-500">
{`Body: { token, title, body }`}
              </pre>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-orange-400 font-mono mb-2">POST /v1/notifications/broadcast-challenge</p>
              <p className="text-gray-400">등록된 전체 사용자에게 알림 전송</p>
              <pre className="mt-2 text-xs text-gray-500">
{`Body: { title?, body? }`}
              </pre>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-green-400 font-mono mb-2">POST /v1/notifications/register</p>
              <p className="text-gray-400">FCM 토큰 등록 (앱에서 자동 호출)</p>
              <pre className="mt-2 text-xs text-gray-500">
{`Body: { token, userId? }`}
              </pre>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>API Base URL: {API_BASE_URL}</p>
        </div>
      </div>
    </div>
  );
}


