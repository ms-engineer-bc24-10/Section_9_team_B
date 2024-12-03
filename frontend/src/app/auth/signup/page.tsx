'use client';

import { useState } from 'react';
import { signUp } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUpPage = () => {
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

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      // 成功時の処理（ホームページへリダイレクト）
      router.push('/');
    } catch (error) {
      setError('サインアップに失敗しました。もう一度お試しください。');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2>アカウントを作成</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div>
            <div>
              <label htmlFor="email-address">メールアドレス</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                パスワード（確認）
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="パスワード（確認）"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div>{error}</div>}

          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'サインアップ'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link href="/auth/signin">既にアカウントをお持ちの方はこちら</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
