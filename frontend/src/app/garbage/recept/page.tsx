'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchUserData from '@/utils/fetchUserData';

export default function GarbageBagUp() {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      setError('画像を選択してください。');
      return;
    }

    setStatus(null);
    setError(null);

    try {
      const userData = await fetchUserData();

      const formData = new FormData();
      formData.append('image', image);
      formData.append('tourist_spot_id', '1'); // 固定または選択可能に
      formData.append('user_id', userData.userId);

      const response = await fetch(
        'http://localhost:8000/garbage-bags/upload/',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus(`アップロード成功: ${data.points}ポイント獲得`);
        router.push('/garbage/complete');
      } else {
        setError(data.error || '画像のアップロードに失敗しました。');
      }
    } catch (e) {
      console.error('Error uploading image:', e);
      setError('画像のアップロードに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div>
      <Header />
      <h1>ゴミ袋アップロード</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setImage(event.target.files ? event.target.files[0] : null)
          }
        />
        <button type="submit">アップロード</button>
      </form>
      {status && <p> {status}</p>}
      {error && <p> {error}</p>}
      <Footer />
    </div>
  );
}
