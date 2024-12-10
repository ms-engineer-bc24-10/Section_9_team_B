import Link from 'next/link';

const function LoginForm = () => (
  <div className="flex flex-col gap-4 w-full max-w-md">
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        メールアドレス
      </label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="メールアドレスを入力"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
        パスワード
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="パスワードを入力"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
    <Link
      href="/auth/login"
      className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center"
    >
      ログイン
    </Link>
  </div>
);

export default LoginForm;
