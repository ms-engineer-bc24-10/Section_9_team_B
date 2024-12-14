import { auth } from './firebase';

export const initAuthStateObserver = () => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      // ユーザーがログインしている場合
      const idToken = await user.getIdToken(true);
      localStorage.setItem('firebaseIdToken', idToken);
    } else {
      // ユーザーが未ログインの場合、ローカルストレージからトークンを削除
      localStorage.removeItem('firebaseIdToken');
    }
  });
};
