// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-blue-500 text-white py-4 fixed top-0 left-0 z-10">
      <div className="text-center">
        <h1 className="text-xl font-bold">ひろいっぽ</h1>
      </div>
      <nav className="mt-2 flex justify-center space-x-4">
        <Link href="/mypage" className="text-lg font-bold hover:underline">
          マイページ
        </Link>
        <Link
          href="/garbage/recept"
          className="text-lg font-bold hover:underline"
        >
          ごみ判定
        </Link>
        <Link
          href="/payment/one-time-payment"
          className="text-lg font-bold hover:underline"
        >
          予約
        </Link>
        <Link
          href="/history/payment-list"
          className="text-lg font-bold hover:underline"
        >
          決済履歴
        </Link>
        <Link href="/home" className="text-lg font-bold hover:underline">
          ログアウト
        </Link>
      </nav>
    </header>
  );
}
