'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { initAuthStateObserver } from '@/utils/authStateObserver';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ヘッダーを表示したいページを指定
  const WithHeader = ['/garbage'];

  // 認証状態を管理
  useEffect(() => {
    const unsubscribe = initAuthStateObserver();
    return () => unsubscribe();
  }, []);

  return (
    <html lang="ja">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="flex flex-col min-h-screen">
        {/* pathnameが指定したページに含まれる場合のみヘッダーを表示 */}
        {WithHeader.includes(pathname) && <Header />}

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
