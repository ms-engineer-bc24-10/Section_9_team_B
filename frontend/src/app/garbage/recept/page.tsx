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
    <div className="min-h-screen bg-blue-200 flex flex-col">
      <Header />

      {/* 背面にゴミ箱の画像を小さく、上に配置 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none mt-60 z-0">
        <img
          src="/img/garbade_gomi.png" // ゴミ箱の画像パス
          alt="ゴミ箱"
          className="w-20 h-24  "
        />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-white text-3xl font-bold mb-5 relative z-20">
          ゴミ袋アップロード
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setImage(event.target.files ? event.target.files[0] : null)
            }
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition"
          >
            ファイル選択
          </label>
          {/* 選択されたファイル名を表示 */}
          {image && <p className="mt-2 text-blue-700">{image.name}</p>}

          <button
            type="submit"
            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-300 transition mt-10"
          >
            アップロード
          </button>
        </form>
        {status && <p className="text-green-500 mt-4">{status}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <Footer />
    </div>
  );
}
