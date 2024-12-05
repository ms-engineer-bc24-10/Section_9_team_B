'use client';

import React from 'react';
import apiClient from '@/utils/apiClient';

interface PaymentButtonProps {
  endpoint: string; // DjangoのエンドポイントURL
  label: string; // ボタンに表示するラベル
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ endpoint, label }) => {
  const handlePayment = async () => {
    try {
      const data = await apiClient(endpoint, {
        method: 'POST', // NOTE: POSTメソッドを指定しないと、GETメソッドと捉えられて405(Method Not Allowed)エラーが出るため
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data.url) {
        console.log('リダイレクト先 URL:', data.url);
        window.location.href = data.url; // Stripe Checkoutページにリダイレクト
      } else {
        alert('URLが取得できませんでした');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('支払いに失敗しました。');
    }
  };

  return (
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
      onClick={handlePayment}
    >
      {label}
    </button>
  );
};

export default PaymentButton;
