'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import fetchUserData from '@/utils/fetchUserData';
import Image from 'next/image';
import Header from '@/components/Header'; // ヘッダーコンポーネント
import Footer from '@/components/Footer'; // フッターコンポーネント

interface UserData {
  userId: string | number;
  username: string;
  email: string;
  role: string;
  idToken: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const isParticipating = searchParams.get('is_participating');
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // クエリパラメータがまだ取得できていない場合の処理
  if (!userId || !isParticipating) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        データを読み込み中...
      </div>
    ); // ローディングメッセージを表示
  }
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error('ユーザーデータの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [router]);

  if (loading) {
    return <div>ユーザーデータを取得中...</div>; // ローディングメッセージを表示
  }

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center">
      {/* ヘッダー */}
      <Header />

      {/* 成功メッセージ */}
      <h1 className="text-2xl text-blue-500 font-bold mb-4 flex items-center">
        🎉 支払いが成功しました 🎉
      </h1>
      <button onClick={() => router.push('/mypage')}>マイページへ戻る</button>
      {/* 画像 */}
      <Image
        src="/img/payment_success.png" // 画像のパス。publicフォルダに画像を入れておく
        alt="成功イメージ"
        width={300} // 適切なサイズを設定
        height={300}
        className="mb-8"
      />

      {/* キラキラ背景要素 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full bg-white opacity-10" />
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
}
