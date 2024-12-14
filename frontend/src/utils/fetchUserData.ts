import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

async function fetchUserData() {
  try {
    console.log('ユーザー情報を取得します...');

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('ユーザーが認証されていません。');
      throw new Error('ユーザーが認証されていません。ログインが必要です。');
    }

    const idToken = await getIdToken(currentUser, true);
    localStorage.setItem('firebaseIdToken', idToken);

    // Firebase ID トークンを取得
    // let idToken = await currentUser.getIdToken(/* forceRefresh */ true); // NOTE: リロード時にユーザーが未認証の場合にトークンを再取得する処理

    // トークンをローカルストレージに保存
    // localStorage.setItem('firebaseIdToken', idToken);

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
      console.log(
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
      console.error('認証エラー: ログインが必要です。');
      throw new Error('認証エラー: ログインが必要です。');
    } else {
      console.error(
        `サーバーエラー: ステータスコード=${response.status}, メッセージ=${response.statusText}`,
      );
      throw new Error(`サーバーエラー: ${response.statusText}`);
    }
  } catch (error) {
    console.error(
      `ユーザー情報の取得中に予期しないエラーが発生しました: ${error}`,
    );
    throw new Error(`${error}`);
  }
}

export default fetchUserData;
