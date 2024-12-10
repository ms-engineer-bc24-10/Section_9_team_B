export default function PaymentRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      {/* 見出し */}
      <h1 className="text-3xl font-bold text-center mb-8">支払い情報登録</h1>

      {/* 支払い情報セクション */}
      <section className="w-full max-w-lg bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">キャッシュバック金額</h2>
        <p className="text-lg font-medium text-gray-700 mb-4">¥200</p>

        <h2 className="text-xl font-bold mb-4">ゴミ拾い参加</h2>
        <div className="flex items-center space-x-4 mb-6">
          <label>
            <input
              type="radio"
              name="participation"
              value="yes"
              className="mr-2"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="participation"
              value="no"
              className="mr-2"
            />
            No
          </label>
        </div>

        <h2 className="text-xl font-bold mb-4">入山料</h2>
        <p className="text-lg font-medium text-gray-700 mb-4">¥2,000</p>

        <h2 className="text-xl font-bold mb-4">利用料金</h2>
        <p className="text-lg font-medium text-gray-700 mb-4">¥4,000</p>
      </section>
    </div>
  );
}
