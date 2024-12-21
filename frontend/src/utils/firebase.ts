'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';

// 環境変数の読み込み確認
// console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence);

// テスト環境では空オブジェクトを返す
const app =
  process.env.NODE_ENV === 'test'
    ? ({} as ReturnType<typeof initializeApp>) // 型キャストでエラー回避
    : !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp();

const auth =
  process.env.NODE_ENV === 'test'
    ? ({} as Auth) // 型キャストでエラー回避
    : getAuth(app);

if (process.env.NODE_ENV !== 'test') {
  setPersistence(auth, browserLocalPersistence);
}

export { app, auth, firebaseConfig };
