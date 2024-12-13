'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/utils/apiClient';
import fetchUserData from '@/utils/fetchUserData';

export default function CashbackPage() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        // ユーザーデータを取得
        const userData = await fetchUserData();

        // 最新のゴミ袋データを取得
        const data = await apiClient(
          'http://localhost:8000/api/garbage-bag/latest/',
          {
            headers: {
              Authorization: `Bearer ${userData.idToken}`,
            },
          },
        );

        setPoints(data.points);
      } catch (err) {
        console.error('Error fetching points:', err);
        setError('ポイント情報の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <header className="w-full bg-blue-500 text-white py-4 text-center fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">ごみ袋判定完了</h1>
      </header>

      <main className="w-full max-w-md bg-white shadow rounded-lg p-6 mt-20 text-center flex-grow">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">Thank You</h1>
            <h2 className="text-xl font-bold mb-4">
              🎉 {points} ポイント獲得！ 🎉
            </h2>
          </div>
        )}

        <Link
          href="/mypage"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition inline-block"
        >
          マイページへ戻る
        </Link>
      </main>
    </div>
  );
}
