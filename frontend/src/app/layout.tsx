import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
