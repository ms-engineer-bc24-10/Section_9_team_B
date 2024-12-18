'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import fetchUserData from '@/utils/fetchUserData';
import Link from 'next/link';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUserData(); // ユーザー情報を取得
        setUsername(user.username); // ユーザー名を状態に保存

        // バッジ情報を取得
        const { idToken } = user;

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
      } catch (err: any) {
        console.error('MyPageでのエラー:', err.message);
        setError(err.message); // エラーメッセージを状態に保存
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await fetchUserData();
          setUsername(userData.username);

          // スタンプ情報を取得
          const stampsResponse = await fetch(
            'http://localhost:8000/api/garbage/user-stamps/',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${userData.idToken}`,
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
            setError('スタンプ情報の取得に失敗しました。');
          }
        } catch (err) {
          console.error('ユーザーデータの取得に失敗:', err);
          setError(
            'ユーザー情報の取得に失敗しました。再度ログインしてください。',
          );
        }
      } else {
        setError('ユーザーが認証されていません。ログインしてください。');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // TODO: バッチ→スタンプカードの仕組みに合うよう文言調整

  return (
    <>
      <header className="w-full bg-blue-400 text-white py-4 fixed top-0 left-0 z-10">
        <div className="flex h-full">
          <h1 className="text-xl font-bold ml-40">ひろいっぽ</h1>
        </div>
      </header>

      <div
        className="w-full h-full flex flex-col items-center bg-gray-100 p-1 pt-5 pb-10 text-xs"
        style={{ backgroundColor: '#bfdbfe' }}
      >
        {/* ボタンエリア */}
        <div className="flex gap-4">
          {[
            {
              src: '/img/badge/my page.png',
              href: '/mypage',
            },
            {
              src: '/img/badge/gomi.png',
              href: '/garbage/recept',
            },
            {
              src: '/img/badge/reservation.png',
              href: '/payment/one-time-payment',
            },
            {
              src: '/img/badge/payment_history.png',
              href: '/history/payment-list',
            },
            {
              src: '/img/badge/logout_bo.png',
              href: '/home',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative w-16 h-10 text-center -translate-x-12"
            >
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <Image
                  src={item.src}
                  width={150}
                  height={150}
                  alt={`${item.text}ボタン`}
                  className="object-cover"
                />
                <p
                  className="absolute text-white font-bold"
                  style={{
                    top: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.9rem',
                  }}
                >
                  {item.text}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* イベント紹介 */}
        <h1 className="text-2xl font-bold mb-2 text-white pt-20 -translate-x-10">
          ようこそ{username || 'ゲスト'}さん
        </h1>

        {/* フレーム画像 */}
        <div className="relative flex justify-center my-5 -translate-x-10">
          <Image
            src="/stamps/stamp_frame.png"
            alt="スタンプフレーム"
            layout="intrinsic"
            width={300}
            height={300}
            className="z-0"
          />

          {/* スタンプ画像 */}
          <div className="absolute inset-0 flex items-center justify-center z-10 mt-32 -translate-x-3 -translate-y-6">
            <div className="grid grid-cols-5 gap-x-10 grid-cols-5  w-4/5 h-2 transform -translate-y-40">
              {[
                '/stamps/1badge.png',
                '/stamps/2badge.png',
                '/stamps/3badge.png',
                '/stamps/4badge.png',
                '/stamps/5badge.png',
              ].map((src, index) => (
                <div
                  key={index}
                  className="rounded-lg flex items-center justify-center h-10 w-10 mt-32"
                >
                  <Image
                    src={src}
                    alt={`スタンプ ${index + 1}`}
                    width={130}
                    height={130}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error ? (
          <div className="text-center -translate-x-10">
            <p className="text-red-500 mb-4">{error}</p>
            <a
              href="/home"
              className="text-blue-500 underline hover:text-blue-700"
            >
              ホームページに戻る
            </a>
          </div>
        ) : (
          <>
            {/*ポイント表示 */}
            <section className="mt-20">
              <div className="flex justify-center items-center space-x-4 ">
                <Image
                  src="/img/point.png"
                  alt="葉っぱの画像"
                  width={450}
                  height={400}
                />
                {/* ポイント数（画像の前面に表示） */}
                <p className="absolute top-[140%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red text-4xl font-bold z-20 text-b text-gray-500">
                  {userStamps ? userStamps.total_points : 0}
                </p>
              </div>
            </section>

            {/* 一番下に画像を追加 
            
            <div className="w-full flex justify-center mb-10">
              <Image
                src="/img/mypage_sita.png" // 画像パスをここに設定
                alt="一番下の画像"
                width={500} // 幅
                height={100} // 高さ
                className="object-contain"
              />
            </div>
            */}
          </>
        )}
      </div>
      {/* フッター */}
      <Footer />
    </>
  );
}
