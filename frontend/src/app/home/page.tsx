'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import Image from 'next/image';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功時の処理
      router.push('/mypage');
    } catch (error) {
      setError(
        'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
      );
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-200">
      {/* ヘッダー */}
      <div className="text-xl font-bold text-center py-4 text-white bg-blue-400 fixed top-0 left-0 w-full z-10">
        ひろいっぽ
      </div>

      {/* 富士山セクション (丸い枠) */}

      <div className="relative1 flex justify-center items-center mt-10">
        {/* 丸いフレーム */}
        <div className="  w-[500px] h-[320px] rounded-full  flex items-center justify-center ">
          {/* 富士山画像 */}
          <div className="  w-full h-full bg-[url('/img/fuji_background.jpg')] bg-cover bg-center" />
        </div>
      </div>

      {/* イベント紹介 */}
      <section className="relative py-20 bg-blue-200 flex justify-center">
        <div className="w-full  flex flex-col items-center ">
          {/* 丸いフレームの追加 */}
          <div className="bg-white rounded-full p-5 border-2 border-blue-400  w-48 mb-5"></div>

          {/* イベント紹介タイトル */}
          <h2 className="text-center text-2xl font-bold text-blue-500 mb-5 relative -top-14 ">
            イベント紹介
          </h2>

          {/* イベント紹介の文用の枠 */}
          <div className="bg-white  p-10  border-2 border-blue-400 text-center w-auto max-w-[1200px] relative -top-5 ">
            <p className="text-blue-500 mb-4">
              本日は富士山にお越しいただきありがとうございます
            </p>
            <p className="text-blue-500 mb-4">
              安全に十分気をつけて登山をお楽しみください！
            </p>
            <p className="text-blue-500 mb-4">「イベント情報」</p>
            <p className="text-blue-500 mb-4">
              現在、富士山でゴミ拾いミッションイベントを開催中。
            </p>
            <p className="text-blue-500 mb-4">
              ゴミ拾いにご協力いただくと、 <br />
              お礼としてポイントプレゼント実施中！
            </p>
            <p className="text-blue-500">この機会にぜひご参加ください</p>
          </div>
        </div>
      </section>

      {/* 登山可能日 */}

      <section className=" relative flex items-center justify-center py-3 bg-blue-80 bg-cover bg-no-repeat bg-center bg-[150%]">
        <div className="max-w-lg mx-auto">
          <div className="grid place-items-center  rounded-full p-6 h-1 w-30 bg-white border-2 border-blue-400">
            <h2 className="text-center rounded-full text-2xl font-bold text-blue-500 mb-4 relative -top-4 ">
              登山可能日
            </h2>

            <div className=" cloudii justify-center items-center bg-calendar bg-no-repeat bg-contain bg-center  bg-[100%] ">
              {/* 簡易カレンダー */}
              <div className="  text-center mt-4">
                <div className=" text-blue-500 text-2xl ">
                  Su Mo Tu We Th Fr Sa
                </div>
                <div className="  grid grid-cols-7 gap-2 mt-2">
                  {Array.from({ length: 30 }, (_, i) => (
                    <span
                      key={i}
                      className={`${
                        [0, 6].includes((i + 1) % 7)
                          ? 'text-red-300'
                          : 'text-blue-500'
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メールアドレスとパスワード */}
      <section className="flex items-center justify-center min-h-[50vh] bg-blue-80 mt-60 ">
        <div className="w-full max-w-sm bg-white shadow rounded-lg p-6 mb-4 border-2 border-blue-400">
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
            ログイン
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-500 "
              >
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded  border-blue-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 border-2 border-blue-300"
                required
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 border-2 border-blue-300"
                required
              />
            </div>
            {error && <p>{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-300 text-white py-2 rounded shadow hover:bg-blue-400 transition "
            >
              ログイン
            </button>
          </form>
        </div>
      </section>

      {/* 新規登録ボタン */}
      <section className="text-center  mb-20">
        <a
          href="/auth/signup"
          className="px-6 py-3 bg-white text-blue-500 rounded shadow hover:bg-blue-300 transition"
        >
          新規登録
        </a>
      </section>

      {/* 一番下に画像を追加 */}
      <div className="w-full flex justify-center mb-10">
        <Image
          src="/img/mypage_sita.png" // 画像パスをここに設定
          alt="一番下の画像"
          width={1200} // 幅
          height={300} // 高さ
          className="object-contain"
        />
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
}
