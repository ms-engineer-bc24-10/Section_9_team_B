# テスト設計書

## 概要

本設計書は、Django を用いた決済機能および Stripe 連携のテストを行うためのものです。以下のエンドポイントを対象とします。

- `create_subscription`: サブスクリプションセッションの作成
- `create_one_time_payment`: 都度払いセッションの作成
- `stripe_webhook`: Stripe Webhook の処理

各機能について、ユニットテストと統合テストを設計します。

---

## 対象機能

### 1. `create_subscription`

- **目的**: サブスクリプション用の Stripe セッションを正しく作成できるか確認する。
- **入力**:
  - `POST`リクエスト
  - `user_id` (必須)
- **期待される出力**:
  - 成功時: セッション URL (`url`) を含む JSON レスポンスを返す。
  - 失敗時: エラーレスポンスを返す。

#### テストケース

| テスト ID | テスト内容                     | 入力データ                          | 期待される結果         |
| --------- | ------------------------------ | ----------------------------------- | ---------------------- |
| TCS1-01   | 正常なリクエスト               | `user_id`: "12345"                  | セッション URL を返す  |
| TCS1-02   | `user_id`が空                  | `user_id`: 空                       | 400 エラーを返す       |
| TCS1-03   | リクエストメソッドが`POST`以外 | `GET`リクエスト                     | 405 エラーを返す       |
| TCS1-04   | Stripe API エラー              | Stripe API をモックしてエラーを発生 | エラーレスポンスを返す |

---

### 2. `create_one_time_payment`

- **目的**: 都度払い用の Stripe セッションを正しく作成できるか確認する。
- **入力**:
  - `POST`リクエスト
  - `user_id` (必須)
  - `reservation_date` (必須)
  - `is_participating` (任意)
- **期待される出力**:
  - 成功時: セッション URL (`url`) を含む JSON レスポンスを返す。
  - 失敗時: エラーレスポンスを返す。

#### テストケース

| テスト ID | テスト内容                           | 入力データ                                           | 期待される結果         |
| --------- | ------------------------------------ | ---------------------------------------------------- | ---------------------- |
| TCS2-01   | 正常なリクエスト                     | `user_id`: "12345", `reservation_date`: "2024-12-31" | セッション URL を返す  |
| TCS2-02   | `user_id`が空                        | `user_id`: 空                                        | 400 エラーを返す       |
| TCS2-03   | `reservation_date`が空               | `reservation_date`: 空                               | 400 エラーを返す       |
| TCS2-04   | リクエストメソッドが`POST`以外       | `GET`リクエスト                                      | 405 エラーを返す       |
| TCS2-05   | Stripe API エラー                    | Stripe API をモックしてエラーを発生                  | エラーレスポンスを返す |
| TCS2-06   | `is_participating`が指定されない場合 | `user_id`: "12345", `reservation_date`: "2024-12-31" | セッション URL を返す  |

---

### 3. `stripe_webhook`

- **目的**: Stripe Webhook の受信イベントを正しく処理し、データベースに取引を登録できるか確認する。
- **入力**:
  - Webhook リクエスト
  - `checkout.session.completed`イベント
- **期待される出力**:
  - 成功時: HTTP 200 を返す。
  - 失敗時: HTTP 400 または 500 を返す。

#### テストケース

| テスト ID | テスト内容                      | 入力データ                                 | 期待される結果                      |
| --------- | ------------------------------- | ------------------------------------------ | ----------------------------------- |
| TCS3-01   | 正常な Webhook イベント         | 正常な`checkout.session.completed`イベント | HTTP 200 を返す                     |
| TCS3-02   | 不正なペイロード                | 不正なリクエストボディ                     | HTTP 400 を返す                     |
| TCS3-03   | 署名検証エラー                  | 不正な署名ヘッダー                         | HTTP 400 を返す                     |
| TCS3-04   | データベース登録失敗            | 重複する `stripe_session_id`               | HTTP 500 を返し、エラーを記録する   |
| TCS3-05   | 未対応の Webhook イベントを受信 | 未対応のイベント                           | HTTP 200 を返す（ログのみ記録）     |
| TCS3-06   | 支払い失敗イベント              | `invoice.payment_failed`イベント           | 適切にログを記録し、HTTP 200 を返す |

---

## テスト環境

- **フレームワーク**: `pytest` + `pytest-django`
  - Django 設定でインメモリ SQLite を利用するように構成。
- **Stripe モックツール**: `stripe-mock` を利用
- **データベース**: インメモリ SQLite データベース（テスト終了時に自動破棄）
- **カバレッジ測定**:
  ツール: pytest-cov を使用。
  目標: ステートメントカバレッジ 85%以上。
  実行例:
  ```
  pytest --cov=your_project_directory --cov-report=term-missing
  ```
  実行されなかったコード行を表示し、カバレッジを確認。
  必要に応じて HTML レポートを生成:
  ```
  pytest --cov=your_project_directory --cov-report=html
  ```

---

## 実施手順

1. **Django 設定の変更**

   - テスト環境でインメモリ SQLite を使用するように設定します。
     ```python
     DATABASES = {
         "default": {
             "ENGINE": "django.db.backends.sqlite3",
             "NAME": ":memory:",
         }
     }
     ```

2. **Stripe API のモック**

   - `stripe-mock` を使用して、模擬的な Stripe API を構築。

3. **ユニットテストの実行**

   - 入力値のバリデーションやレスポンスの形式を検証します。
   - データベースエラーが発生しないケースを中心に検証します。

4. **統合テストの実行**

   - インメモリ SQLite を利用し、データベースとの連携を含む一連の処理を検証します。
   - 特に、以下のケースを重点的にテストします：
     - `TCS3-01`: 正常な Webhook イベントでデータベース登録。
     - `TCS3-04`: ユニーク制約違反で登録失敗。

5. テストカバレッジの確認
   - コマンドを使用して測定結果を取得し、目標カバレッジを満たしているか確認します。