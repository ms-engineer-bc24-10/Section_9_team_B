import Link from 'next/link';

export default function CashbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* ヘッダー */}
      <header className="w-full bg-blue-500 text-white py-4 text-center fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">キャッシュバック完了</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-md bg-white shadow rounded-lg p-6 mt-20 text-center flex-grow">
        <h2 className="text-xl font-bold mb-4">
          キャッシュバックが完了しました！
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          ご利用いただきありがとうございます。キャッシュバックが正常に処理されました。
        </p>

        {/* ホームへ戻るボタン */}
        <Link
          href="/home"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition inline-block"
        >
          ホームへ戻る
        </Link>
      </main>
    </div>
  );
}
