import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* ヘッダー */}
      <header className="w-full bg-green-600 p-4 flex justify-center">
        <h1 className="text-white text-2xl font-bold">ひろいっぽ</h1>
      </header>

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center mt-8 w-full px-4">
        {/* イベント紹介 */}
        <section className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">イベント紹介</h2>
          <p className="text-gray-500">ゴミを拾ってポイントを貯めよう！</p>
        </section>

        {/* 登山可能日 */}
        <section className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">登山可能日</h2>
          {/* カレンダー装飾 */}
          <div className="grid grid-cols-7 gap-2">
            {[
              '12/10',
              '12/11',
              '12/12',
              '12/13',
              '12/14',
              '12/15',
              '12/16',
              '12/17',
              '12/18',
              '12/19',
              '12/20',
              '12/21',
              '12/22',
              '12/23',
            ].map((date, index) => (
              <div
                key={index}
                className={`flex justify-center items-center p-2 border rounded ${
                  ['12/15', '12/16', '12/17'].includes(date)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {date}
              </div>
            ))}
          </div>
        </section>

        {/* メールアドレスとパスワード入力欄 */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* メールアドレス入力 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="メールアドレスを入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="パスワードを入力"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* ログインと新規登録ボタン */}
          <Link
            href="/auth/login"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center"
          >
            ログイン
          </Link>
          <Link
            href="/auth/register"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center border"
          >
            新規登録
          </Link>
        </div>
      </div>

      {/* フッター */}
      <footer className="mt-auto bg-gray-800 w-full p-4 text-center text-white">
        <p>&copy; 2024 ゴミ拾いアプリ. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
