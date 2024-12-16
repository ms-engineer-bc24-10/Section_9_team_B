'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentButton from '@/components/PaymentButton';
import Image from 'next/image';

const SubscriptionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col relative">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center justify-center flex-grow relative ">
        {/* サブスクリプションタイトル */}
        <div className="bg-white rounded-xl px-6 py-3  mb-10 text-center">
          <h1 className="text-lg font-bold text-blue-400 ">
            サブスクリプションを開始します⇩
          </h1>
        </div>

        {/* サブスクリプションボタン */}
        <div className="rounded-xl px-6 py-3 text-center mb-20">
          <PaymentButton
            endpoint="http://localhost:8000/payments/create-subscription/"
            label="サブスクリプションを購入"
            className="text-black font-bold"
          />
        </div>

        {/* 画像エリア */}
        <div className="absolute bottom-10 top-50">
          <Image
            src="/img/subusuku.png" // publicフォルダに配置
            alt="サブスクリプション"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
