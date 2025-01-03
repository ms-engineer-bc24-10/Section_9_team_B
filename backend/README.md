# Backend: ひろいっぽ

このディレクトリは、Web アプリ「ひろいっぽ」のバックエンド部分を管理しています。Django をベースに構築されており、データベース管理、API 提供、Google Cloud Vision API や Stripe、Firebase との連携などを担当します。

---

## 📂 ディレクトリ構成

バックエンドの主な構成は以下の通りです:

```
backend/
├── .env                    # 環境変数ファイル
├── .env.test               # テスト用の環境変数ファイル
├── .python-version         # 使用するPythonバージョンを指定
├── README.md               # バックエンド部分の説明と使用方法
├── compose.yml             # Docker Composeの設定ファイル
├── config/                 # アプリケーション設定関連
│   ├── __init__.py         # パッケージ初期化用
│   ├── asgi.py             # ASGIサーバー設定
│   ├── settings.py         # プロジェクト全体の設定
│   ├── test_settings.py    # テスト専用の設定ファイル
│   ├── urls.py             # URLルーティング設定
│   └── wsgi.py             # WSGIサーバー設定
├── custom_auth/            # カスタム認証機能
│   ├── admin.py            # 管理画面設定
│   ├── apis.py             # APIエンドポイント
│   ├── authentication.py   # 認証処理
│   ├── models.py           # データベースモデル
│   ├── urls.py             # 認証関連のルーティング
│   └── views.py            # 認証関連のビュー
├── firebase_test.py        # Firebase連携テストスクリプト
├── garbage_analysis/       # ごみ解析関連
│   ├── __init__.py         # パッケージ初期化用
│   ├── admin.py            # 管理画面設定
│   ├── apps.py             # アプリケーション設定
│   ├── google_vision.py    # Google Vision API連携
│   ├── models.py           # データベースモデル
│   ├── tests/              # テストスクリプト
│   │   ├── test_google_vision.py
│   │   └── test_views.py
│   ├── urls.py             # ごみ解析関連のルーティング
│   └── views.py            # ごみ解析関連のビュー
├── google_vision_key.json  # Google Vision API認証キー
├── logs/                   # ログファイル（本番環境用）
│   ├── app.log             # アプリケーションログ
│   └── errors.log          # エラーログ
├── manage.py               # Django管理スクリプト
├── payments/               # 決済関連
│   ├── admin.py            # 管理画面設定
│   ├── models.py           # データベースモデル
│   ├── tests.py            # テストスクリプト
│   ├── urls.py             # 決済関連のルーティング
│   └── views.py            # 決済関連のビュー
├── pytest.ini              # pytestの設定ファイル
├── requirements.txt        # 必要なパッケージリスト
├── serviceAccountKey.json  # Firebase管理者認証キー
├── stripe_webhook.log      # Stripe Webhookテストログ
├── tools/                  # ツール関連
│   └── stripe-mock         # Stripeモックツール
└── tourist_spots/          # 観光地情報管理
    ├── admin.py            # 管理画面設定
    ├── models.py           # データベースモデル
    ├── tests.py            # テストスクリプト
    ├── urls.py             # 観光地関連のルーティング
    └── views.py            # 観光地関連のビュー

```

---

## 🚀 セットアップと開発方法

### 必要なツール

- **Python**: 3.12.7
- **PostgreSQL**: 16.6
- **Docker & Docker Compose**: データベースのコンテナ管理に必要

---

### セットアップ手順

1. リポジトリをクローン:

   ```bash
   git clone git@github.com:ms-engineer-bc24-10/Section_9_team_B.git
   cd backend
   ```

2. Python 仮想環境を作成し、必要なパッケージをインストール:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. 環境変数ファイル（`.env`）を作成し、以下を記載:

   ```
   DB_USER=your_db_user
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   SECRET_KEY=your_django_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. データベースコンテナを起動（初回のみ）:

   ```bash
   docker-compose -f compose.yml up -d
   ```

5. Django のマイグレーションを実行:

   ```bash
   python manage.py migrate
   ```

6. 管理者アカウントを作成（初回のみ）:

   ```bash
   python manage.py createsuperuser
   ```

7. 開発サーバーを起動:

   ```bash
   python manage.py runserver localhost:8000
   ```

8. Stripe CLI の Webhook リスナーを起動:

   ```bash
   stripe listen --forward-to http://localhost:8000/payments/stripe-webhook/ --skip-verify --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
   ```

---

## 📦 主な依存ライブラリ

- **Django**: バックエンドフレームワーク
- **Django REST Framework**: API 開発
- **PostgreSQL**: データベース
- **Firebase Admin SDK**: 認証機能
- **Google Cloud Vision API**: 画像解析
- **Stripe**: 決済機能
- **Django CORS Headers**: CORS サポート
- **Python Decouple/Dotenv/Django environ**: 環境変数管理

---

## 🌟 環境変数

以下の環境変数が必要です（`.env`を**Section_9_team_B/backend/ディレクトリのルート**に保存）:

### PostgreSQL

- `DB_USER`
- `DB_NAME`
- `DB_PASSWORD`

### Django

- `SECRET_KEY`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 🔧 Firebase 認証

Firebase Admin SDK を使用して認証を行っています。

### 必要なセットアップ

1. Firebase プロジェクトを作成し、サービスアカウントキーをダウンロードします。
2. ダウンロードしたキーを`serviceAccountKey.json`として**Section_9_team_B/backend/ディレクトリのルート**に保存します。
3. バックエンドはこのファイルを使用して Firebase と連携します。

### 主な使用例

- ユーザー認証（例: ログイン、サインアップ）
- 認証済みユーザーのトークン検証

---

## 🔧 Google Cloud Vision API

Google Cloud Vision API を利用して画像解析を行っています。

### 必要なセットアップ

1. Google Cloud プロジェクトでサービスアカウントを作成し、キーをダウンロードします。
2. キーファイル（例: `google_vision_key.json`）を**Section_9_team_B/backend/ディレクトリのルート**に保存します。
3. `.env`で Google Cloud の認証キーを指定します。

---

## 🔔 Webhook 設定（Stripe 関連）

Stripe の決済通知を受け取るため、以下の設定が必要です:

1. **Stripe CLI を使用した Webhook**:

   ```bash
   stripe listen --forward-to http://localhost:8000/payments/stripe-webhook/ --skip-verify --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
   ```

2. **Webhook シークレット**:

   Stripe Webhook シークレットは`.env`に設定する必要があります（`STRIPE_WEBHOOK_SECRET`）。

3. **デバッグ**:

   Webhook リクエストが正しく受信されているか確認してください。

---

## 🌐 主なエンドポイント

バックエンドで提供される API エンドポイントの詳細です。

### 認証関連

- `/api/auth/signup/`: ユーザー登録
- `/api/auth/user/`: 認証済みユーザー情報取得

### ごみ解析関連

- `/garbage-bags/upload/`: ごみ袋のアップロード
- `/api/garbage/user-stamps/`: ユーザーのスタンプ情報取得
- `/api/garbage/api/garbage-bag/latest/`: 最新のごみ袋情報取得

### 決済関連

- `/payments/create-subscription/`: サブスクリプション決済の作成
- `/payments/create-one-time-payment/`: 一回限りの決済の作成
- `/payments/stripe-webhook/`: Stripe Webhook エンドポイント
- `/api/payment-history/`: 決済履歴 エンドポイント
- `/api/payment-history/<int:transaction_id>/`: 決済詳細 エンドポイント

### CSRF トークン取得

- `/api/csrf-token/`: CSRF トークンを取得

---

## 🔍 開発時の注意点

- **秘密情報管理**: `.env`ファイル、`google_vision_key.json`、`serviceAccountKey.json`は git 管理から除外してください。
- **データベース起動**: PostgreSQL コンテナが起動していることを確認してください。
- **サーバーの起動 URL**: フロントエンドは localhost:3000、バックエンドは localhost:8000 で起動してください。
- **ロギング**: `logging`モジュールで開発用ログを確認できます。

### Linter & Formatter

コードの一貫性と品質を保つために以下の Linter と Formatter を使用しています。

- **Linter**: Pylint

  - **適用範囲**: Python（Django アプリケーション）
  - **使用方法**:
    - **VSCode の拡張機能を利用**:
      - VSCode の Pylint 拡張機能をインストールすると、コードをリアルタイムでチェックできます。
    - **コマンドラインでの実行**（オプション）:
      - コマンドラインで使用する場合、以下のコマンドを実行する前に `pylint` をインストールしてください:
        ```bash
        pip install pylint
        pylint backend/
        ```

- **Formatter**: Black
  - **適用範囲**: Python ファイル全般
  - **使用方法**:
    - **VSCode の拡張機能を利用**:
      - VSCode の Black Formatter 拡張機能をインストールすると、ファイル保存時に自動フォーマットが実行されます。
    - **コマンドラインでの実行**（オプション）:
      - コマンドラインで使用する場合、以下のコマンドを実行する前に `black` をインストールしてください:
        ```bash
        pip install black
        black backend/
        ```
- VSCode の拡張機能を使用する場合、Pylint と Black をローカル環境にインストールする必要はありません。ただし、コマンドラインで実行する場合は、それぞれのツールを Python 環境にインストールしてください。
- コードをコミットする前に Linter と Formatter を実行し、コードの品質を確認してください。

### テスト

- Django 標準のテストフレームワークを利用して、API エンドポイントおよび機能のテストを行います。

  ```
  python manage.py test
  ```

- 決済機能については、Pytest を使用してテストを行います（`.env,test`ファイルが必要）。

  ```
  pytest payments/tests/ --cov=payments --cov-report=term-missing
  ```

  コマンドを使用すると、テストと同時に、カバレッジ測定と実行されなかったコード行をターミナルに表示させることができます。
