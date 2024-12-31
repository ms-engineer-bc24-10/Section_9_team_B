import { getIdToken } from 'firebase/auth';
import clientLogger from '@/utils/clientLogger';
import { auth } from './firebase';

async function fetchUserData() {
  try {
    clientLogger.debug('ユーザー情報を取得します...');

    const { currentUser } = auth;

    if (!currentUser) {
      throw new Error('ユーザーが認証されていません。ログインが必要です。');
    }

    // Firebase ID トークンを取得
    const idToken = await getIdToken(currentUser, true);
    // トークンをローカルストレージに保存
    localStorage.setItem('firebaseIdToken', idToken);

    const response = await fetch('http://localhost:8000/api/auth/user/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      clientLogger.debug(
        `ユーザー情報の取得に成功: ${data}ユーザーID=${data.user_id}, ユーザー名=${data.username}, メール=${data.email}, ロール=${data.role}}`,
      );
      return {
        userId: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role,
        idToken,
      };
    }
    if (response.status === 401) {
      throw new Error('認証エラー: ログインが必要です。');
    } else {
      clientLogger.error(
        `サーバーエラー: ステータスコード=${response.status}, メッセージ=${response.statusText}`,
      );
      throw new Error(`サーバーエラー: ${response.statusText}`);
    }
  } catch (error) {
    clientLogger.error(
      `ユーザー情報の取得中に予期しないエラーが発生しました: ${error}`,
    );
    throw new Error(`${error}`);
  }
}

export default fetchUserData;
