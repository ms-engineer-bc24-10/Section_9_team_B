import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full bg-blue-400 text-white items-start py-4 text-center">
        <h1 className="text-2xl font-bold">決済キャンセル</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-md bg-white shadow rounded-lg p-6 mt-20 text-center">
        <h2 className="text-xl font-bold text-blue-400 mb-4">
          決済がキャンセルされました
        </h2>
        <p className="text-sm text-blue-400 mb-3">
          決済処理がキャンセルされました。
        </p>

        <p className="text-sm text-blue-400 mb-6">
          再度やり直す場合は、以下のリンクをクリックしてください。
        </p>

        {/* 再試行ボタン */}
        <Link
          href="/payment"
          className="px-3 py-2 bg-blue-400 text-white rounded shadow hover:bg-blue-600 transition"
        >
          決済ページへ戻る
        </Link>
      </main>
    </div>
  );
}
