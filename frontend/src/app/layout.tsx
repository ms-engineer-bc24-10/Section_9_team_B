'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ヘッダーを表示したいページを指定
  const WithHeader = ['/mypage', '/garbage'];

  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        {/* pathnameが指定したページに含まれる場合のみヘッダーを表示 */}
        {WithHeader.includes(pathname) && <Header />}
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
