'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
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

// Firebase初期化
const initializeFirebaseApp = (): FirebaseApp => {
  if (process.env.NODE_ENV === 'test') {
    return {} as FirebaseApp; // テスト環境では空オブジェクトを返す
  }
  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

// 認証初期化
const initializeFirebaseAuth = (app: FirebaseApp): Auth => {
  if (process.env.NODE_ENV === 'test') {
    return {} as Auth; // テスト環境では空オブジェクトを返す
  }
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
  return auth;
};

const app = initializeFirebaseApp();
const auth = initializeFirebaseAuth(app);

export { app, auth, firebaseConfig };
