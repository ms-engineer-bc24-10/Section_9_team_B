'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchUserData from '@/utils/fetchUserData';
interface UserData {
  userId: string | number;
  username: string;
  email: string;
  role: string;
  idToken: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error('ユーザーデータの取得に失敗しました:', error);
      }
    };

    getUserData();
  }, []);

  const handleReturnToMyPage = () => {
    if (userData) {
      router.push('/mypage');
    } else {
      console.error('ユーザーデータが利用できません。');
      router.push('/home'); // ユーザーデータがない場合、ホーム画面へ遷移
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>支払いに成功しました！</h1>
      <button onClick={handleReturnToMyPage}>マイページへ戻る</button>
    </div>
  );
}
