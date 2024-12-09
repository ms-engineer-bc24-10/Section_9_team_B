import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 pt-20 pb-20">
        {/* ヘッダー */}

        {/* イベント紹介 */}
        <section className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">イベント紹介</h1>
          <p>ごみ拾いをしてポイントを貯めよう！</p>
        </section>

        {/* 登山可能日 */}
        <section className="w-full max-w-lg bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">登山可能日</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">日付</th>
                  <th className="border border-gray-300 px-4 py-2">曜日</th>
                  <th className="border border-gray-300 px-4 py-2">状態</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '12/10', day: '日曜日', status: '可能' },
                  { date: '12/11', day: '月曜日', status: '可能' },
                  { date: '12/12', day: '火曜日', status: '不可' },
                  { date: '12/13', day: '水曜日', status: '可能' },
                  { date: '12/14', day: '木曜日', status: '不可' },
                  { date: '12/15', day: '金曜日', status: '可能' },
                  { date: '12/16', day: '土曜日', status: '可能' },
                ].map((entry) => (
                  <tr
                    key={entry.date}
                    className={`${
                      entry.status === '可能' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {entry.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {entry.day}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {entry.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* メールアドレスとパスワード */}
        <section className="w-full max-w-sm bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </label>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 transition"
            >
              ログイン
            </button>
          </form>
        </section>

        {/* 新規登録ボタン */}
        <section className="text-center">
          <a
            href="/auth/signup"
            className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            新規登録
          </a>
        </section>

        {/* フッター */}
      </div>
      <Footer />
    </>
  );
}
