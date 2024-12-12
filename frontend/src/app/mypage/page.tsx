'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import fetchUserData from '@/utils/fetchUserData';

interface Stamp {
  tourist_spot_id: number;
  date: string;
  points: number;
}
interface UserStamps {
  stamps: string[];
  total_points: number;
}

// 観光地IDとスタンプ画像のマッピング
// NOTE: スタンプ画像は public/stamps/ に格納
const stampImages: { [key: number]: string } = {
  1: '/stamps/stamp1.png', // 富士山
  2: '/stamps/stamp2.png', // 他の観光地
  // 以下他の観光地のスタンプ画像を追加
};

export default function MyPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStamps, setUserStamps] = useState<UserStamps | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUserData(); // ユーザー情報を取得
        setUsername(user.username); // ユーザー名を状態に保存
      } catch (err: any) {
        console.error('MyPageでのエラー:', err.message);
        setError(err.message); // エラーメッセージを状態に保存
            
          // バッジ情報を取得
          const stampsResponse = await fetch(
            'http://localhost:8000/api/garbage/user-stamps/',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          );

          if (stampsResponse.ok) {
            const stampsData = await stampsResponse.json();
            setUserStamps(stampsData);
          } else {
            console.error(
              'Failed to fetch stamps data:',
              stampsResponse.statusText,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    loadUserData();
  }, []);

  // TODO: バッチ→スタンプカードの仕組みに合うよう文言調整
  return (
    <>
      {/* ヘッダー */}
      <Header />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 pt-20 pb-20">
        {/* イベント紹介 */}
        <h1 className="text-3xl font-bold mb-4">
          ようこそ{username || 'ゲスト'}さん
        </h1>

        {error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <a
              href="/home"
              className="text-blue-500 underline hover:text-blue-700"
            >
              ホームページに戻る
            </a>
        <h3 className="text-3xl font-bold mb-4">所有しているバッチ</h3>
        <p className="mb-5">↓バッチ一覧↓</p>
        <section className="flex flex-wrap justify-center gap-4 mb-8">
          {userStamps && userStamps.stamps.length > 0 ? (
            userStamps.stamps.map((stamp, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={
                    stampImages[stamp.tourist_spot_id] || '/stamps/default.png'
                  }
                  alt={`観光地${stamp.tourist_spot_id}のスタンプ`}
                  width={100}
                  height={100}
                />
                <p className="text-sm mt-2">{stamp.date}</p>
              </div>
            ))
          ) : (
            <p>獲得したスタンプはありません</p>
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
              point {userStamps ? userStamps.total_points : 0}P
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-bold mb-4">所有しているバッチ</h3>
            <p className="mb-5">↓バッチ一覧↓</p>
            <section>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                初めてゴミ拾ったバッジ
              </span>
              {/* 他のバッチ... */}
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                2回目ゴミ拾ったバッジ
              </span>
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
                <p className="text-sm">point 20P</p>
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
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
