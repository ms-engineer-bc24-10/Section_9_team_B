'use client';

import React from 'react';
import PaymentButton from '@/components/PaymentButton';

const SubscriptionPage: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>サブスクリプションを開始する</h1>
    <PaymentButton
      endpoint="http://localhost:8000/payments/create-subscription/"
      label="サブスクリプションを購入する"
    />
  </div>
);

export default SubscriptionPage;
