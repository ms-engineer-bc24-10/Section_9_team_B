// const CancelPage: React.FC = () => {
// return (
// <div style={{ textAlign: 'center', marginTop: '50px' }}>
// <h1>支払いがキャンセルされました。</h1>
// <p>もう一度お試しください。</p>
// </div>
// );
// };

// export default CancelPage;

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* ヘッダー */}
      <header className="w-full bg-blue-500 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">決済キャンセル</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-md bg-white shadow rounded-lg p-6 mt-4 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          決済がキャンセルされました
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          決済処理がキャンセルされました。再度やり直す場合は、以下のリンクをクリックしてください。
        </p>

        {/* 再試行ボタン */}
        <Link
          href="/payment"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          決済ページへ戻る
        </Link>
      </main>
    </div>
  );
}
