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
      console.log('取得したユーザー情報:', userData);

      // 決済履歴APIを呼び出す
      // TODO: apiエンドポイントの修正
      const data = await apiClient(
        `http://localhost:8000/api/payment-history?user_id=${userData.userId}`,
      );
      setPaymentHistory(data); // 決済履歴データを保存
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
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>決済履歴</h1>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}
