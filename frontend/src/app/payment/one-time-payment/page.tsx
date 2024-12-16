'use client';

import React from 'react';
import Image from 'next/image'; // Imageコンポーネントをインポート
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentButton from '@/components/PaymentButton';

function EntryFeePage() {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col relative">
      <Header />

      {/* コンテンツ部分 */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-6  ">
        {/* 入場料支払い画面タイトル */}
        <div className="bg-white rounded-full px-8 py-3 relative -top-20 ">
          <h1 className="text-blue-500 text-xl font-bold flex items-center “">
            💰 入場料支払い画面
          </h1>
        </div>

        {/* 支払いボタンエリア */}
        <div className="w-full flex justify-center mt-20">
          {' '}
          {/*下に下げて色をかえる（後で微調整）*/} {/* mt-10 で下に配置 */}
          <PaymentButton
            endpoint="http://localhost:8000/payments/create-one-time-payment/"
            label="入場料を支払う"
            includeParticipation // ごみ拾い参加フラグを表示
            includeDate // 予約日付選択を表示
            className="bg-blue-400 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-500 transition"
          />
        </div>
      </div>

      {/* 一番下に画像を追加 */}
      <div className="w-full flex justify-center mt-10 mb-10">
        <Image
          src="/img/payment_frame2.png" // publicフォルダ内の画像パス
          alt="Footer Image" // 代替テキスト
          width={900} // 横幅
          height={500} // 高さ
        />
      </div>
      <Footer />
    </div>
  );
}

export default EntryFeePage;
