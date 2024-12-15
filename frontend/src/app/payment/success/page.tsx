// const SuccessPage: React.FC = () => (
//   <div style={{ textAlign: 'center', marginTop: '50px' }}>
//     <h1>支払いに成功しました！</h1>
//   </div>
// );

// export default SuccessPage;

'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header'; // ヘッダーコンポーネント
import Footer from '@/components/Footer'; // フッターコンポーネント

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center">
      {/* ヘッダー */}
      <Header />

      {/* 成功メッセージ */}
      <h1 className="text-2xl text-blue-500 font-bold mb-4 flex items-center">
        🎉 支払いが成功しました 🎉
      </h1>

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
};

export default SuccessPage;
