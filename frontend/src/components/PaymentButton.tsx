'use client';

import React, { useState } from 'react';
import apiClient from '@/utils/apiClient';
import fetchUserData from '@/utils/fetchUserData';

interface PaymentButtonProps {
  endpoint: string;
  label: string;
  includeParticipation?: boolean; // ごみ拾いフラグを含むか
  includeDate?: boolean; // 日付選択を含むか
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  endpoint,
  label,
  includeParticipation = false,
  includeDate = false,
}) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsParticipating(event.target.checked);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePayment = async () => {
    try {
      const userData = await fetchUserData();

      const bodyData: any = {
        user_id: userData.userId,
        ...(includeParticipation && { is_participating: isParticipating }),
        ...(includeDate && { reservation_date: selectedDate }),
      };

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
      {includeDate && (
        <div>
          <label htmlFor="reservation-date">予約日: </label>
          <input
            type="date"
            id="reservation-date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </div>
      )}
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
