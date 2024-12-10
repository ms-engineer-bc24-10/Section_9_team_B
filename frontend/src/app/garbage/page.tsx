'use client';

import { useState } from 'react';

export default function GarbageBagUp() {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('tourist_spot_id', '1'); // 固定または選択可能に

    try {
      const response = await fetch(
        'http://localhost:8000/garbage-bags/upload/',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatus('Error uploading image');
    }
  };

  return (
    <div>
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
      {status && <p>ステータス: {status}</p>}
    </div>
  );
}
