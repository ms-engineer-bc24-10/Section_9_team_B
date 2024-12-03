import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // ユーザー情報をDjangoバックエンドに送信
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // ユーザー情報をDjangoバックエンドに送信
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    // ログアウト後の処理
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
