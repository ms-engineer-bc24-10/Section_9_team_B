'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import fetchUserData from '@/utils/fetchUserData';

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
    return <div>データを読み込み中...</div>; // ローディングメッセージを表示
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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>支払いに成功しました！</h1>
      <button onClick={() => router.push('/mypage')}>マイページへ戻る</button>
    </div>
  );
}
