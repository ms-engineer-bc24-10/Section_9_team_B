'use client';

import React, { useState } from 'react';
import apiClient from '@/utils/apiClient';
import fetchUserData from '@/utils/fetchUserData';

interface PaymentButtonProps {
  endpoint: string;
  label: string;
  includeParticipation?: boolean; // ごみ拾いフラグを含むか
  includeDate?: boolean; // 日付選択を含むか
  className?: string; // ここを追加（入場料を支払うボタン）
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  endpoint,
  label,
  includeParticipation = false,
  includeDate = false,
  className, // classNameをpropsから受け取る（入場料支払いボタン）
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
    <div className="flex flex-col items-center">
      {includeDate && (
        <div className="fflex flex-col items-center bg-white rounded-lg px-6 py-4 w-full max-w-md">
          <label
            htmlFor="reservation-date"
            className="text-blue-500 font-bold text-lg mb-"
          >
            予約日
          </label>
          <input
            type="date"
            id="reservation-date"
            value={selectedDate}
            onChange={handleDateChange}
            required
            className="w-full p-4 text-lg  rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      )}
      {includeParticipation && (
        <label className="flex justify-center items-center bg-white rounded-full px-4 py-2  text-blue-500 font-bold text-lg mt-10">
          <input
            type="checkbox"
            checked={isParticipating}
            onChange={handleCheckboxChange}
            className=""
          />
          ごみ拾いに参加します
        </label>
      )}
      <br />
      <button
        onClick={handlePayment}
        className={`bg-blue-400 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-400 transition ${className || ''}`} //入場料支払いボタン追加
      >
        {label}
      </button>
    </div>
  );
};

export default PaymentButton;
