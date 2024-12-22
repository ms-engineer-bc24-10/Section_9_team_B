'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { signUp } from '../../../utils/auth';
import { validateUsername, validateEmail } from '../../../utils/validation';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ユーザー名バリデーション
    if (!validateUsername(username)) {
      setError(
        'ユーザー名は英数字、アンダースコア、日本語文字のみ使用できます。',
      );
      setLoading(false);
      return;
    }

    // メールアドレスバリデーション
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError('有効なメールアドレスを入力してください');
      setLoading(false);
      return;
    }

    // パスワード一致チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。もう一度入力してください。');
      setLoading(false);
      return;
    }

    try {
      // Firebase サインアップ処理
      await signUp(username, trimmedEmail, password);
      router.push('/mypage');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            setError(
              '無効なメールアドレス形式です。正しいメールアドレスを入力してください。',
            );
            break;
          default:
            setError('サインアップに失敗しました。もう一度お試しください。');
        }
      } else if (error instanceof Error) {
        setError(error.message || '予期せぬエラーが発生しました。');
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex flex-col items-center justify-center bg-signup bg-cover bg-center">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full bg-blue-400 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">新規登録</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="relative w-full max-w-sm bg-white shadow rounded-lg p-6 border-4 border-blue-300">
        <h2 className="text-xl font-bold mb-4 text-white text-center relative -top-14">
          新規アカウント登録
        </h2>
        <p className="text-sm text-blue-500 text-center mb-6 relative -top-12">
          アカウント情報を入力してください。
        </p>

        {/* エラーメッセージ */}
        {error && (
          <div
            data-testid="error-message"
            className="text-red-500 text-sm mb-4"
          >
            {error}
          </div>
        )}

        {/* フォーム */}
        <form role="form" onSubmit={handleSubmit}>
          {/* ユーザー名 */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-blue-500"
            >
              ユーザー名
            </label>
            <input
              type="text"
              id="username"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded border-2 border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* メールアドレス */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-500"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded border-2 border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* パスワード */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-500"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded border-2 border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* パスワード（確認） */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-blue-500"
            >
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="パスワードを再入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded border-2 border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-${loading ? '200' : '300'} text-white py-2 rounded shadow hover:bg-blue-${
              loading ? '200' : '400'
            } transition disabled:opacity-50`}
          >
            {loading ? 'Processing...' : '登録'}
          </button>
        </form>

        {/* ログインリンク */}
        <div className="text-sm text-center mt-4">
          <Link href="/home" className="text-blue-500 hover:underline">
            既にアカウントをお持ちの方はこちら
          </Link>
        </div>
      </main>
    </div>
  );
}
