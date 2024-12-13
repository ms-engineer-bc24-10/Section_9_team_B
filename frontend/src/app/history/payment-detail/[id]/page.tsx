'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiClient from '@/utils/apiClient';
import fetchUserData from '@/utils/fetchUserData';

interface PaymentDetail {
  id: number;
  date: string;
  amount: number;
  status: string;
  tourist_spot: string;
  is_participating: boolean;
  stripe_session_id: string;
}

export default function PaymentDetail({ params }: { params: { id: string } }) {
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        const userData = await fetchUserData();
        const data = await apiClient(
          `http://localhost:8000/api/payment-history/${params.id}/`,
          {
            headers: {
              Authorization: `Bearer ${userData.idToken}`,
            },
          },
        );
        setPaymentDetail(data);
      } catch (err) {
        setError('決済詳細の取得に失敗しました');
        console.error('Error fetching payment detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetail();
  }, [params.id]);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    if (!paymentDetail) {
      return <div>決済情報が見つかりません</div>;
    }
    return (
      <div>
        <p>日付: {paymentDetail.date}</p>
        <p>金額: {paymentDetail.amount}円</p>
        <p>ステータス: {paymentDetail.status}</p>
        <p>観光地: {paymentDetail.tourist_spot}</p>
        <p>
          ごみ拾い参加: {paymentDetail.is_participating ? '参加' : '不参加'}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>決済詳細</h1>
        {renderContent()}
        <button onClick={() => router.back()} style={{ marginTop: '20px' }}>
          戻る
        </button>
      </div>
      <Footer />
    </div>
  );
}
