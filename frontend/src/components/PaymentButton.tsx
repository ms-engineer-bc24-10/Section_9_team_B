'use client';

import React, { useState } from 'react';
import apiClient from '@/utils/apiClient';
import { getCsrfTokenFromCookie, fetchCsrfToken } from '@/utils/auth';

interface PaymentButtonProps {
  endpoint: string;
  label: string;
  includeParticipation?: boolean; // ごみ拾いフラグを含むか
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  endpoint,
  label,
  includeParticipation = false,
}) => {
  const [isParticipating, setIsParticipating] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsParticipating(event.target.checked);
  };

  const handlePayment = async () => {
    try {
      const bodyData: any = includeParticipation
        ? { is_participating: isParticipating }
        : {};

      const data = await apiClient(endpoint, {
        method: 'POST', // NOTE: POSTメソッドを指定しないと、GETメソッドと捉えられて405(Method Not Allowed)エラーが出るため
        body: JSON.stringify(bodyData),
      });

      if (data.url) {
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
    <div>
      {includeParticipation && (
        <label style={{ marginBottom: '10px', display: 'block' }}>
          <input
            type="checkbox"
            checked={isParticipating}
            onChange={handleCheckboxChange}
          />
          ごみ拾いに参加します
        </label>
      )}
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
    </div>
  );
};

export default PaymentButton;
