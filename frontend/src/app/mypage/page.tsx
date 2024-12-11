'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getAuth } from 'firebase/auth';

interface UserBadges {
  badges: string[];
  total_points: number;
}

export default function MyPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadges | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Firebase IDトークンを取得
          const idToken = await user.getIdToken();

          // Djangoバックエンドからユーザー情報を取得
          const userResponse = await fetch(
            'http://localhost:8000/api/auth/user/',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          );

          if (userResponse.ok) {
            const data = await userResponse.json();
            setUsername(data.username); // バックエンドから取得したusernameをセット
          } else {
            console.error(
              'Failed to fetch user data:',
              userResponse.statusText,
            );
          }

          // バッジ情報を取得
          const badgesResponse = await fetch(
            'http://localhost:8000/api/garbage/user-badges/',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          );

          if (badgesResponse.ok) {
            const badgesData = await badgesResponse.json();
            setUserBadges(badgesData);
          } else {
            console.error(
              'Failed to fetch badges data:',
              badgesResponse.statusText,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* ヘッダー */}
      <Header />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 pt-20 pb-20">
        {/* イベント紹介 */}
        <h1 className="text-3xl font-bold mb-4">
          ようこそ{username || 'ゲスト'}さん
        </h1>
        <h3 className="text-3xl font-bold mb-4">所有しているバッチ</h3>
        <p className="mb-5">↓バッチ一覧↓</p>
        <section>
          {userBadges && userBadges.badges.length > 0 ? (
            userBadges.badges.map((badge, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {badge}
              </span>
            ))
          ) : (
            <p>獲得したバッジはありません</p>
          )}
        </section>

        <section className="mt-20">
          <div className="flex justify-center items-center space-x-2">
            <Image
              src="/leaf_01.png"
              alt="葉っぱの画像"
              layout="intrinsic"
              width={50}
              height={50}
            />
            <p className="text-sm">
              point {userBadges ? userBadges.total_points : 0}P
            </p>
          </div>
        </section>

        {/* 決済履歴 */}
        <section className="mt-10 w-full max-w-4xl bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">決済履歴</h2>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-4 py-2">日付</th>
                <th className="border border-gray-200 px-4 py-2">内容</th>
                <th className="border border-gray-200 px-4 py-2">金額</th>
                <th className="border border-gray-200 px-4 py-2">状態</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: '2024/12/01',
                  description: 'ゴミ拾い参加費',
                  amount: '¥1,000',
                  status: '完了',
                },
                {
                  date: '2024/12/02',
                  description: '入山料',
                  amount: '¥2,000',
                  status: '未払い',
                },
                {
                  date: '2024/12/03',
                  description: 'キャッシュバック',
                  amount: '-¥500',
                  status: '完了',
                },
              ].map((entry) => (
                <tr key={entry.date} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.date}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.description}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.amount}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <Footer />
    </>
  );
}
