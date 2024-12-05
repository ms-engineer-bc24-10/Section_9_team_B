import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from './firebase';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// CSRFトークンを取得する関数
const fetchCsrfToken = async (): Promise<string> => {
  const response = await fetch('http://localhost:8000/api/csrf-token/', {
    credentials: 'include',
  });
  const data = await response.json();
  return data.csrfToken;
};

// ユーザー情報をDjangoバックエンドに送信
const sendUserToDjango = async (user: User) => {
  try {
    const idToken = await user.getIdToken();
    const csrfToken = await fetchCsrfToken();
    const response = await fetch('http://localhost:8000/api/auth/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `===ユーザーデータのバックエンド送信失敗===: ${errorDetails.error || response.statusText}`,
      );
    }
  } catch (e) {
    console.error('===ユーザーデータのバックエンド送信でエラー発生===', e);
    throw e;
  }
};

// 認証結果の処理を共通化
const handleAuthResult = async (
  userCredential: UserCredential,
): Promise<User> => {
  const { user } = userCredential;

  try {
    await sendUserToDjango(user);
  } catch (error) {
    console.error(
      '===バックエンドへのユーザー情報送信中にエラーが発生===',
      error,
    );
    throw error;
  }

  return user;
};

const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return await handleAuthResult(userCredential);
  } catch (e) {
    console.error('===サインアップエラー===', e);
    throw e;
  }
};

const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return await handleAuthResult(userCredential);
  } catch (e) {
    console.error('===サインインエラー===', e);
    throw e;
  }
};

const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    const csrfToken = await fetchCsrfToken();
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    });
  } catch (e) {
    console.error('===サインアウトエラー===', e);
    throw e;
  }
};

export { app, auth, signUp, signIn, signOutUser };
