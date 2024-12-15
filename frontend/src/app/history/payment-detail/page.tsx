'use client';

import React from 'react';
import Header from '@/components/Header'; // ヘッダーコンポーネント
import Footer from '@/components/Footer'; // フッターコンポーネント

const PaymentDetail: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-200">
      {/* ヘッダー */}
      <Header />

      {/* ページコンテンツ */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl text-white font-bold mb-4">決済詳細</h1>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default PaymentDetail;
