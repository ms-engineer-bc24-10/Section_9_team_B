'use client';

import React from 'react';
import PaymentButton from '@/components/PaymentButton';

const SubscriptionPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>サブスクリプションを開始する</h1>
      <PaymentButton
        endpoint="http://127.0.0.1:8000/payments/create-subscription/"
        label="サブスクリプションを購入する"
      />
    </div>
  );
};

export default SubscriptionPage;
