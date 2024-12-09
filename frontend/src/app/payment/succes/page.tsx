import Image from 'next/image';
import Link from 'next/link';

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* ヘッダー */}
      <header className="w-full bg-blue-500 text-white py-4 text-center fixed top-0 left-0">
        <h1 className="text-2xl font-bold">決済完了</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full max-w-md bg-white shadow rounded-lg p-6 mt-20 mb-20 text-center">
        <div className="relative">
          {/* 吹き出し画像 */}
          <Image
            src="/frontend/public/images copy.jpeg" // publicディレクトリに保存した画像のパス
            alt="決済完了イメージ"
            width={200}
            height={200}
            className="mx-auto"
          />
          {/* 吹き出し内のテキスト */}
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-blue-700">
            決済が完了しました！
          </p>
        </div>

        {/* サンクスメッセージ */}
        <p className="text-sm text-gray-500 mt-4">
          ご利用いただきありがとうございます。決済が正常に処理されました。
        </p>

        {/* ホームへ戻るボタン */}
        <Link href="/home">
          <button
            type="button" // type属性を追加
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            ホームへ戻る
          </button>
        </Link>
      </main>

      {/* フッター */}
      <footer className="w-full bg-gray-800 text-white py-2 text-center fixed bottom-0 left-0">
        <p className="text-sm">© 2024 ひろいっぽ</p>
      </footer>
    </div>
  );
}
