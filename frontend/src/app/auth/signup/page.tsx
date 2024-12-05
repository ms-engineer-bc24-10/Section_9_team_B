export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* ヘッダー */}
      <header className="w-full bg-blue-500 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">新規登録</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center w-full mt-10 px-4">
        <form className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
          {/* ユーザー名 */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">メールアドレス</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="メールアドレスを入力"
            />
          </div>
          {/* パスワード */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="パスワードを入力"
            />
          </div>
          {/* 登録ボタン */}
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            登録
          </button>
        </form>
      </main>
    </div>
  );
}
