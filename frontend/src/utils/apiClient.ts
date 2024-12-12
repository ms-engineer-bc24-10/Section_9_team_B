import { getCsrfTokenFromCookie, fetchCsrfToken } from './auth';

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // クッキーから CSRF トークンを取得し、なければサーバーから取得
    const csrfToken = getCsrfTokenFromCookie() || (await fetchCsrfToken());

    console.log('取得した CSRF トークン:', csrfToken);

    const requestOptions = {
      mode: 'cors' as RequestMode,
      credentials: 'include', // NOTE: セッションを維持するため
      headers: {
        'Content-Type': 'application/json',
        ...options.headers, // 呼び出し元で追加のヘッダーを指定可能
        'X-CSRFToken': csrfToken, // 必ず最後に追加して上書きを防ぐ
      },
      ...options,
    };

    console.log('API リクエストヘッダー:', requestOptions.headers);
    console.log('API リクエストオプション:', requestOptions);

    // Fetch API を使用してリクエストを送信
    const response = await fetch(endpoint, requestOptions);

    console.log('API レスポンスステータス:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API レスポンスエラー:', errorText);
      throw new Error(`APIリクエストが失敗しました: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API リクエストエラー:', error);
    throw error;
  }
};

export default apiClient;
