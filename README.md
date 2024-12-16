# ひろいっぽ

「ひろいっぽ」は、富士山などの観光地でのポイ捨て問題に対応し、ごみ拾いを促進するための Web アプリケーションです。環境保全を目的とし、登山者や観光客が主体的に参加できる仕組みを提供します。

---

## 🎯 プロジェクト概要

### 背景

富士山などの自然遺産や観光地では、増加する登山者や観光客によるポイ捨てが問題となっており、富士山だけでも年間平均で約 2,600 トンもの不法投棄が報告されています。これらのゴミの撤去には多額の費用が必要であり、根本的な対策が急務です。

### 目的

- 富士山でのごみ拾いを促進し、登山道や山頂周辺のポイ捨て問題を軽減する。
- 登山客を巻き込み、環境保全への意識を高める。
- 将来的には他の観光地にも応用可能な汎用的な Web アプリを構築する。

**注記**: 本プロジェクトは最終プロジェクトとして富士山を対象にしたプロトタイプを開発するものであり、実際のリリースは想定していません。

### 機能一覧

- **ごみ袋のアップロードと解析**:
  - Google Cloud Vision API を利用して、ごみ袋の内容を自動解析。
- **ユーザー認証と管理**:
  - Firebase Admin SDK を使用した認証機能（ログイン、サインアップ）。
- **ポイント管理**:
  - ごみ拾い後の袋の大きさに応じてポイントを付与。
- **スタンプ収集**:
  - ごみ拾い活動参加ごとにスタンプを記録し、活動履歴を表示。
- **決済機能**:
  - Stripe を利用したサブスクリプション型および一回限りの決済。
- **管理者機能**:
  - 登録ユーザーや解析データの管理機能。

---

## 主要技術

### **フロントエンド**

- **Next.js**: ユーザーインターフェース構築。
- **TailwindCSS**: モダンなスタイリングフレームワークで迅速なデザイン実装。
- **Firebase Authentication**: ユーザー認証のための安全で簡便な認証システム。

### **バックエンド**

- **Django**: 高速な開発とセキュリティを重視した Web フレームワーク。
- **Django REST Framework**: API 開発用のフレームワークで柔軟かつシンプルな設計。
- **PostgreSQL**: 信頼性の高いオープンソースのリレーショナルデータベース。
- **Firebase Admin SDK**: 認証やデータ管理をバックエンドから直接操作。
- **Google Cloud Vision API**: AI を活用した画像解析機能を実装。
- **Stripe**: 決済処理やサブスクリプション機能の実現。

### **インフラ・ツール**

- **Docker & Docker Compose**: PostgreSQL データベースのコンテナ化による柔軟な環境構築。
- **Stripe CLI**: 開発環境での Webhook テストを簡素化。
- **GitHub**: プロジェクト管理およびバージョン管理システム。

---

## 📂 ディレクトリ構成

```
！！！！要追加！！！！
```

---

## 🚀 セットアップと開発方法

### 必要なツール

- **Node.js**: 18.17.0（フロントエンド）
- **Python**: 3.12.7（バックエンド）
- **PostgreSQL**: 16.6（データベース）
- **Docker & Docker Compose**: データベース管理用
- **Stripe CLI**: Stripe Webhook リスナー用（任意）

---

### セットアップ手順

1. リポジトリをクローン:

   ```bash
   git clone git@github.com:ms-engineer-bc24-10/Section_9_team_B.git
   ```

2. フロントエンドのセットアップ:

   ```bash
   cd frontend
   npm install
   ```

3. バックエンドのセットアップ:

   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
   pip install -r requirements.txt
   docker-compose -f compose.yml up -d
   python manage.py migrate
   python manage.py createsuperuser  # 初回のみ
   ```

4. 開発サーバーを起動:

   - フロントエンド:

     ```bash
     cd ../frontend
     npm run dev
     ```

   - バックエンド:
     ```bash
     cd ../backend
     python manage.py runserver localhost:8000
     ```

5. Stripe CLI を使用した Webhook リスナーの起動:

   ```bash
   # Stripe CLIのインストール（macOSの場合）
   brew install stripe/stripe-cli/stripe

   # Stripe CLIにログイン
   stripe login

   # Webhookリスナーを起動
   stripe listen --forward-to http://localhost:8000/payments/stripe-webhook/ --skip-verify --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
   ```

---

### Linter & Formatter

このプロジェクトでは、コードの一貫性と品質を保つために以下の Linter と Formatter を使用しています。

### フロントエンド

- **Linter**: ESLint

  - **スタイルガイド**: Airbnb
  - **設定ファイル**: `frontend/.eslintrc.json`
  - **適用範囲**: TypeScript（React.js）コード
  - **スクリプト例**:
    ```bash
    # フロントエンドで ESLint を実行
    cd frontend
    npm run lint
    ```

- **Formatter**: Prettier
  - **設定ファイル**: `frontend/.prettierrc`
  - **適用範囲**: TypeScript ファイル全般
  - **スクリプト例**:
    ```bash
    # フロントエンドで Prettier を実行
    cd frontend
    npm run format
    ```

### バックエンド

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

### 注意点

- フロントエンドは `npm` スクリプトを使用して Linter と Formatter を実行してください。
- バックエンドは VSCode の拡張機能を有効化することで、リアルタイムのフィードバックを得られます。また、コマンドラインでも手動で実行可能です。
- コードをコミットする前に Linter と Formatter を実行し、コードの品質を確認してください。

---

### テスト

テストはフロントエンド・バックエンド双方で実行できます。

- **フロントエンドテスト**:

  - コマンドを使用して単体テストを実行できます。

  ```
  npm test
  ```

  コマンドを使用して単体テストを実行できます。

- **バックエンドテスト**:
  - Django 標準のテストフレームワークを利用して、API エンドポイントおよび機能のテストを行います。
  ```
  python manage.py test
  ```

---

## 💻 フロントエンドとバックエンドの関連

- フロントエンド（Next.js）は、ユーザーがごみ拾いや決済、管理機能を利用するための UI を提供します。
- バックエンド（Django）は、フロントエンドと連携して以下の機能を提供します:
  - ごみ解析（Google Cloud Vision API）
  - ユーザー認証（Firebase Admin SDK）
  - 決済機能（Stripe）
  - データベース管理（PostgreSQL）

バックエンドへのリクエストは`next.config.mjs`で設定された API リライトにより、フロントエンドから自動的に転送されます。

---

## 🗻 使用方法

「ひろいっぽ」は、富士山のごみ拾い活動を記録し、楽しみながら環境保全に参加できる Web アプリです。以下の手順でアプリをご利用ください。

### 1. アカウント作成

- アプリにアクセスし、新規登録ボタンをクリックします。
- ユーザー名、メールアドレス、パスワードを入力してアカウントを作成します。

### 2. ログイン

- 登録したメールアドレスとパスワードを使用してログインします。

### 3. ごみ拾いの予約

- 「マイページ」の「予約」から、希望する予約日とごみ拾いへの参加有無を選択します。
- 入場料を決済画面で支払い、予約を確定します。

### 4. ごみ袋のアップロード

- 「マイページ」の「決済履歴」を入場時に提示して、ごみ拾いセットを受け取ります。
- 活動後、ごみ収集場でごみ袋を撮影し、「マイページ」の「ごみ判定」から写真をアップロードします。

### 5. ポイントとスタンプの確認

- アップロードされた写真は Google Cloud Vision API で解析され、ごみの有無とごみ袋の大きさが算出がされます。
- 解析結果に基づいて、自動的にポイントとスタンプが付与されます。
- 「マイページ」で現在のポイントやスタンプを確認できます。

---

## 🌟 プロジェクトの将来

本プロジェクトは、富士山を対象にごみ拾い促進のプロトタイプを開発するものですが、以下の展望を持っています:

- **他の観光地や地域への展開**:
  システムを一般化し、他の観光地や地域で活用できる Web アプリとして展開する可能性を探ります。
- **新たな機能の追加**:
  - より高精度なごみ解析アルゴリズムの導入
  - 登録ユーザーにおけるポイントやスタンプのランキング機能
- **スマートフォンアプリの開発**:
  スマートフォンからもごみ拾いを簡単に記録できる専用アプリの構築。

---

## 🔍 開発時の注意点

- **秘密情報管理**: `.env`ファイル、`google_vision_key.json`、`serviceAccountKey.json`は必ず git 管理から除外してください。
- **バックエンドとフロントエンド、Stripe CLI Webhook リスナーの同時起動**: 開発時は Next.js サーバー、Django サーバー、PostgreSQL コンテナ、Stripe CLI Webhook リスナーを並行して起動してください。
- **ロギング**: バックエンドでは`logging`モジュールを活用し、開発用ログを確認できます。

---

## 🛠 開発ルール

### GitHub コミットメッセージ規則

| **Prefix** | **用途**                                             |
| ---------- | ---------------------------------------------------- |
| `add`      | 新規ファイルやユーザー向けの機能の追加               |
| `doc`      | ドキュメントの更新                                   |
| `chore`    | プロダクションに影響のない修正（例: タスクファイル） |
| `fix`      | ユーザー向けの不具合の修正                           |
| `refactor` | リファクタリング                                     |
| `style`    | コードのフォーマットやスタイル修正                   |
| `test`     | テストコードの追加や修正                             |
| `delete`   | 不要なファイルや機能の削除                           |

**記述例**:

```
fix: #16 ユーザーログイン機能の修正
```

---

### コード内アノテーションコメント

| **記法**    | **意味**                     |
| ----------- | ---------------------------- |
| `TODO:`     | あとで追加・修正すべき箇所   |
| `FIXME:`    | 既知の不具合があるコード     |
| `HACK:`     | きれいではないが動くコード   |
| `XXX:`      | 危険なコード、動作が不明     |
| `REVIEW:`   | 動作意図の確認が必要         |
| `OPTIMIZE:` | パフォーマンス改善の余地あり |
| `CHANGED:`  | 変更点の記録                 |
| `NOTE:`     | なぜそうしたかのメモ         |
| `WARNING:`  | 注意が必要な箇所             |

---

### ブランチ戦略

**GitHub Flow**を採用し、迅速な開発とデプロイを目指します。

#### **ブランチ構成**

1. **main**ブランチ
   - 常にデプロイ可能な状態を維持。
   - 直接コミットは禁止。
2. **feature**ブランチ
   - 機能開発やバグ修正用。
   - main から分岐し、完了後に main へマージ。

#### **開発フロー**

1. main ブランチから新しい feature ブランチを作成。
2. feature ブランチで開発を行い、小さな単位でコミット。
3. 開発完了後、Pull Request を作成。
4. コードレビューを実施。
5. レビュー承認後、main ブランチへマージ。
6. feature ブランチを削除。

**ルール**:

- main ブランチは常にデプロイ可能な状態を保つ。
- feature ブランチは機能単位で作成し、小さく保つ。
- Pull Request は最低 1 人のレビューを必須とする。
- コンフリクトは feature ブランチ側で解決。
- 緊急のバグ修正も通常の feature ブランチとして扱う。

**ブランチ命名規則**:
`Name_TaskName`（例: Taro_Setting）

---

### GitHub プロジェクト管理

#### **Projects**

- カンバン形式でタスク管理（Todo・In Progress・Done）。
- Todo タスクから Issues を作成。

#### **Issues**

- Projects の Todo から機能単位で作成。
- タスクに着手する際は Issues から作業ブランチを作成。

#### **Pull Requests**

- ローカルで作業後、リモートの feature ブランチにプッシュして Pull Request を作成。
- メンバー 1 人以上のレビューを受け、承認後に main へマージ。
- マージ後、ブランチを削除。ただし、残す場合はコメントで明記。
- マージ内容はチーム全員で共有。

**Pull Request テンプレート**:

```markdown
## issue 番号 概要

## やったこと

## やらないこと

## できるようになること（ユーザ目線）

## できなくなること（ユーザ目線）

## 特にレビューして欲しい箇所

## 動作確認

## その他
```

---

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

## 開発チーム

このプロジェクトは、Section9 teamB ひろいっぽ が開発しています。
