# Frontend: ひろいっぽ

このディレクトリは、Webアプリ「ひろいっぽ」のフロントエンド部分を管理しています。Next.jsを使用して構築されており、ユーザーがごみ拾い関連の操作を行うためのUIを提供します。

---

## 📂 ディレクトリ構成

フロントエンドの主な構成は以下の通りです:

```
！！！！要追加！！！！
```

---

## 🚀 セットアップと開発方法

### 必要なツール

- **Node.js**: 18.17.0（[Volta](https://volta.sh/)でバージョン管理を推奨）
- **npm**: Node.jsに付属
- **Stripe CLI**: Webhookリクエストをテストするために必要（Stripe関連機能使用時のみ）。

### セットアップ手順

1. リポジトリをクローン:

   ```bash
   git clone git@github.com:ms-engineer-bc24-10/Section_9_team_B.git
   cd frontend
   ```

2. 必要なパッケージをインストール:

   ```bash
   npm install
   ```

3. 環境変数ファイル（`.env`）を作成し、以下を記載:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<your-stripe-public-key>
   ```

   下記、環境変数欄も参考にしてください。

4. Stripe CLI Webhookリスナーを起動:

   ```bash
   stripe listen --forward-to http://localhost:8000/payments/stripe-webhook/ --skip-verify --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
   ```

5. 開発サーバーを起動:

   ```bash
   npm run dev
   ```

   ブラウザで`http://localhost:3000`を開きます。

---

## 📦 主なスクリプト

- `npm run dev`：開発サーバーを起動
- `npm run build`：本番用ビルドを作成
- `npm run start`：本番環境でサーバーを起動
- `npm run lint`：コードのLintチェック
- `npm run format`：コードをPrettierでフォーマット

---

## 🌟 環境変数

以下の環境変数が必要です（（`.env`を**Section_9_team_B/frontend/ディレクトリのルート**に保存））:

### Firebase

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Stripe

- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

---

## 🔧 技術スタック

- **Next.js**: フレームワーク
- **React**: UIライブラリ
- **TailwindCSS**: スタイリング
- **Firebase**: 認証とデータ管理
- **Stripe**: 決済機能
- **Google Cloud Vision API**: 画像解析

---

## 🔔 Webhook設定（Stripe関連）

Stripeの決済機能でWebhooksを使用する場合、以下の設定が必要です:

1. **Webhookエンドポイント**:
   Webhookリクエストはバックエンド（Django）に転送されます。エンドポイントは以下のURLを想定しています:

   ```
   http://localhost:8000/payments/stripe-webhook/
   ```

2. **Stripe CLIを使用したテスト**:
   開発環境では、実際のWebhook通知を受け取る代わりにStripe CLIを利用します:

   ```bash
   stripe listen --forward-to http://localhost:8000/payments/stripe-webhook/ --skip-verify --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
   ```

3. **デバッグ**:
   Stripe CLIのログを確認し、正しくリクエストがバックエンドに送信されていることを確認してください。

---

## 📸 Google Cloud Vision API

Google Cloud Vision APIを利用して画像解析を行っています。

1. **特別なセットアップは不要**:
   Google Cloud SDKやキーの設定はバックエンドで行います。

2. **バックエンドとの連携**:
   画像解析リクエストは、フロントエンドから直接Google Cloud Vision APIに送信するのではなく、バックエンド（Django）経由で処理されます。

---

## 🌐 APIリクエストの設定

`next.config.mjs`で以下のリクエストリライトが設定されています:

```js
rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*', // Djangoバックエンド
    },
  ];
}
```

これにより、フロントエンドからのAPIリクエストは自動的にバックエンド（Django）に転送されます。

---

## 🔍 開発時の注意点

- フロントエンドとバックエンド、Stripe CLI Webhookリスナーを並行して起動してください。
- 開発用環境変数を必ず設定してください（`.env`ファイルが必要）。
