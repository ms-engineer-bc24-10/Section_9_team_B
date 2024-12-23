import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
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
  if (!response.ok) {
    throw new Error(`CSRF token fetch failed: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('fetchCsrfTokenで取得したデータ: ', data);
  return data.csrfToken;
};

// クッキーからCSRFトークンを取得する関数
const getCsrfTokenFromCookie = (): string | null => {
  const name = 'csrftoken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const signUp = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
  try {
    const trimmedEmail = email.trim(); // メールアドレスの前後の空白を除去
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      trimmedEmail,
      password,
    );
    const { user } = userCredential;

    // Djangoバックエンドにユーザー情報を送信
    await sendUserToDjango(user, username);

    return user;
  } catch (e) {
    console.error('===サインアップエラー===', e);
    throw e;
  }
};

const sendUserToDjango = async (user: User, username: string) => {
  try {
    const idToken = await user.getIdToken();
    const csrfToken = getCsrfTokenFromCookie() || (await fetchCsrfToken());
    const url = 'http://localhost:8000/api/auth/signup/';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      'X-CSRFToken': csrfToken,
    };
    const body = JSON.stringify({
      uid: user.uid,
      email: user.email,
      username,
    });

    // リクエストの詳細をコンソールに出力
    console.log('Request URL:', url);
    console.log('Request Headers:', headers);
    console.log('Request Body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      credentials: 'include',
    });

    // 実際に送信されているデータ
    console.log('Sending to Django:', {
      uid: user.uid,
      email: user.email,
      username,
    });

    // レスポンスの詳細をコンソールに出力
    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorText = response.statusText || '予期せぬエラーが発生しました。';
      console.error('Error response:', errorText);
      throw new Error(
        `===ユーザーデータのバックエンド送信失敗===: ${errorText}`,
      );
    }
    const data = await response.json();
    console.log('Success Response:', data);
  } catch (error) {
    // catch 節内で error を使用
    console.error('===ユーザーデータのバックエンド送信でエラー発生===', error);
    throw error;
  }
};

const logIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (e) {
    console.error('===ログインエラー===', e);
    throw e;
  }
};

const logOutUser = async (): Promise<void> => {
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
    console.error('===ログアウトエラー===', e);
    throw e;
  }
};

export {
  fetchCsrfToken,
  getCsrfTokenFromCookie,
  app,
  auth,
  signUp,
  logIn,
  logOutUser,
};
