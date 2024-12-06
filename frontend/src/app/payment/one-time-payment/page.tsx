'use client';

import React from 'react';
import PaymentButton from '@/components/PaymentButton';

const EntryFeePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>入場料を支払う</h1>
      <PaymentButton
        endpoint="http://127.0.0.1:8000/payments/create-one-time-payment/"
        label="入場料を支払う"
      />
    </div>
  );
};

export default EntryFeePage;