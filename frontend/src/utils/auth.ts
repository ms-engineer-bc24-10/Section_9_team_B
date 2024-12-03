import { firebaseConfig } from './firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ユーザー情報をDjangoバックエンドに送信
const sendUserToDjango = async (user: User) => {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
      }),
    });
    if (!response.ok) {
      throw new Error('===ユーザーデータのバックエンド送信失敗===');
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
  const user = userCredential.user;
  await sendUserToDjango(user);
  return user;
};

const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return handleAuthResult(userCredential);
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
    return handleAuthResult(userCredential);
  } catch (e) {
    console.error('===サインインエラー===', e);
    throw e;
  }
};

const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {
    console.error('===サインアウトエラー===', e);
    throw e;
  }
};

export { app, auth, signUp, signIn, signOutUser };
