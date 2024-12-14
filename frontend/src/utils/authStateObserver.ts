import { auth } from './firebase';
import { User } from 'firebase/auth';

export const initAuthStateObserver = () => {
  return auth.onAuthStateChanged(async (user: User | null) => {
    const currentPath = window.location.pathname;
    // ホーム画面でのトークン管理を除外
    if (currentPath !== '/home') {
      if (user) {
        // ユーザーがログインしている場合
        const idToken = await user.getIdToken(true);
        localStorage.setItem('firebaseIdToken', idToken);
      } else {
        // ユーザーが未ログインの場合、ローカルストレージからトークンを削除
        localStorage.removeItem('firebaseIdToken');
      }
    }
  });
};
