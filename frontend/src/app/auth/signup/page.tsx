'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { signUp } from '../../../utils/auth';

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

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('有効なメールアドレスを入力してください');
      setLoading(false);
      return;
    }

    try {
      await signUp(trimmedEmail, password);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Firebase特有のエラー処理
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
        // その他のエラー
        setError(error.message || '予期せぬエラーが発生しました。');
      } else {
        setError('予期せぬエラーが発生しました。');
      }
      setError('サインアップに失敗しました。もう一度お試しください。');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* ヘッダー */}
      <header className="w-full bg-blue-500 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">新規登録</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-sm bg-white shadow rounded-lg p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">新規アカウント登録</h2>
        <p className="text-sm text-gray-500 mb-6">
          アカウント情報を入力してください。
        </p>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          {/* ユーザー名 */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              ユーザー名
            </label>
            <input
              type="text"
              id="username"
              placeholder="ユーザー名を入力"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* メールアドレス */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              placeholder="メールアドレスを入力"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* パスワード */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              placeholder="パスワードを入力"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* パスワード（確認） */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="パスワードを再入力"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : '登録'}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <Link href="/home" className="text-blue-500 hover:underline">
            既にアカウントをお持ちの方はこちら
          </Link>
        </div>
      </main>
    </div>
  );
}
