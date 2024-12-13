'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentButton from '@/components/PaymentButton';

function EntryFeePage() {
  return (
    <div>
      <Header />

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>入場料を支払う</h1>
        <PaymentButton
          endpoint="http://localhost:8000/payments/create-one-time-payment/"
          label="入場料を支払う"
          includeParticipation // ごみ拾い参加フラグを表示
          includeDate // 予約日付選択を表示
        />
      </div>
      <Footer />
    </div>
  );
}

export default EntryFeePage;
