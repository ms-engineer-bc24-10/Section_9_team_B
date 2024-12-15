'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchUserData from '@/utils/fetchUserData';
import Image from 'next/image';

export default function GarbageBagUp() {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

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
      formData.append('tourist_spot_id', '1');
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
      <h1>ごみ袋アップロード</h1>
      <p>ごみ袋の大きさからポイントが算出されます</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">アップロード</button>
      </form>
      {preview && (
        <div>
          <h2>画像プレビュー</h2>
          <Image
            src={preview}
            alt="プレビュー"
            width={300}
            height={300}
            objectFit="contain"
          />
        </div>
      )}
      {status && <p>{status}</p>}
      {error && <p>{error}</p>}
      <Footer />
    </div>
  );
}
