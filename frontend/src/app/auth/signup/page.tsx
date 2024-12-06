export default function SignupPage() {
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
        <form>
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
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 transition"
          >
            登録
          </button>
        </form>
      </main>
    </div>
  );
}
