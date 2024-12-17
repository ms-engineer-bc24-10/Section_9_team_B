'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiClient from '@/utils/apiClient';
import fetchUserData from '@/utils/fetchUserData';

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  status: string;
}

export default function PaymentList() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 決済履歴を取得する関数
  const fetchPaymentHistory = async () => {
    try {
      // ユーザー情報を取得
      const userData = await fetchUserData();

      // 決済履歴APIを呼び出す
      const data = await apiClient(
        'http://localhost:8000/api/payment-history/',
        {
          headers: {
            Authorization: `Bearer ${userData.idToken}`,
          },
        },
      );
      setPaymentHistory(data);
    } catch (err) {
      setError('決済履歴の取得に失敗しました');
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // テーブル行クリック時の処理
  const handleRowClick = (id: number) => {
    router.push(`/history/payment-detail/${id}`);
  };

  // コンテンツレンダリング関数
  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return (
        <div style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>
          {error}
        </div>
      );
    }

    return (
      <table style={{ margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>日付</th>
            <th>金額</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment) => (
            <tr
              key={payment.id}
              onClick={() => handleRowClick(payment.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{payment.date}</td>
              <td>{payment.amount}円</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center mt-20">
      <Header />
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold text-white mb-4">決済履歴</h1>

        {/* タイトル */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="bg-white text-blue-500 font-bold rounded-full px-6 py-2 shadow">
            日付
          </div>
          <div className="bg-white text-blue-500 font-bold rounded-full px-6 py-2 shadow">
            金額
          </div>
          <div className="bg-white text-blue-500 font-bold rounded-full px-6 py-2 shadow">
            ステータス
          </div>
        </div>

        {/* 決済履歴テーブル */}
        <div className="bg-white rounded-xl  max-w-[800px] p-10 ml-0">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              onClick={() => handleRowClick(payment.id)}
              className="flex justify-between items-center px-10 py-6 border-b last:border-none cursor-pointer hover:bg-blue-50 transition"
            >
              {/* 1つ目の列: 日付 */}
              <div className="flex-3 flex justify-center px-4">
                <span className="text-blue-400 font-semibold text-xl">
                  {payment.date}
                </span>
              </div>

              {/* 2つ目の列: 金額 */}
              <div className="flex-3 flex justify-center px-4">
                <span className="text-blue-400 font-semibold text-xl">
                  {payment.amount}円
                </span>
              </div>

              {/* 3つ目の列: ステータス */}
              <div className="flex-1 flex justify-cente px-4">
                <span
                  className={`${
                    payment.status === '支払い済み'
                      ? 'text-blue-600'
                      : 'text-red-400'
                  } font-bold text-xl`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
