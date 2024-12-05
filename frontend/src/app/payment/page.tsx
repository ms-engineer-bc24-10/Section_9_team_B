'use client';

import React from 'react';
import apiClient from '@/utils/apiClient';

const PaymentPage: React.FC = () => {
  const handleSubscription = async () => {
    try {
      const data = await apiClient(
        'http://127.0.0.1:8000/payments/create-subscription/',
        {
          method: 'POST', // POST メソッドを指定
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ); // Djangoのエンドポイントを呼び出し

      if (data.url) {
        // Stripe Checkoutページにリダイレクト
        console.log('リダイレクト先 URL:', data.url);
        window.location.href = data.url;
      } else {
        alert('URLが取得できませんでした');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('支払いに失敗しました。');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>サブスクリプションを開始する</h1>
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#6772e5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleSubscription}
      >
        サブスクリプションを購入する
      </button>
    </div>
  );
};

export default PaymentPage;
