# API Design Document: ひろいっぽ

## Overview

「ひろいっぽ」の API 設計書です。この設計書は、アプリケーションで提供される RESTful API エンドポイントと、それに関連するリクエスト・レスポンスの形式を網羅しています。

---

## Base Information

- **Base URL**: `http://localhost:8000/api`
- **Scheme**: `HTTP`

---

## リソース一覧

- **ユーザー認証関連 (`custom_auth`)**: ユーザーの登録や認証に関するエンドポイント。
- **ごみ解析関連 (`garbage_analysis`)**: ごみ袋の解析や関連データの取得を提供するエンドポイント。
- **決済関連 (`payments`)**: 決済の作成や Webhook の受信に関するエンドポイント。
- **観光地 (`tourist_spots`)**: 観光地の情報を管理するエンドポイント。
- **CSRF トークン関連**: CSRF トークンを取得するエンドポイント。

---

## エンドポイント一覧

| リソース      | メソッド | エンドポイント                           | 説明                         |
| ------------- | -------- | ---------------------------------------- | ---------------------------- |
| ユーザー      | POST     | `/api/auth/signup/`                      | ユーザー登録                 |
| ユーザー      | GET      | `/api/auth/user/`                        | 認証済みユーザー情報の取得   |
| ごみ解析      | POST     | `/api/garbage/garbage-bags/upload/`      | ごみ袋情報のアップロード     |
| ごみ解析      | GET      | `/api/garbage/user-stamps/`              | ユーザーのスタンプ情報の取得 |
| ごみ解析      | GET      | `/api/garbage/garbage-bag/latest/`       | 最新のごみ袋情報の取得       |
| 決済          | POST     | `/api/payments/create-subscription/`     | サブスクリプション決済の作成 |
| 決済          | POST     | `/api/payments/create-one-time-payment/` | 都度払い決済の作成           |
| 決済          | POST     | `/api/payments/stripe-webhook/`          | Stripe Webhook 受信          |
| 観光地        | GET      | `/api/tourist-spots/<id>/`               | 特定観光地情報の取得         |
| 観光地        | POST     | `/api/tourist-spots/`                    | 新しい観光地情報の登録       |
| CSRF トークン | GET      | `/api/csrf-token/`                       | CSRF トークンの取得          |

---

### 1. ユーザー認証関連

#### 1-1. ユーザー登録 `POST /api/auth/signup/`

**【リクエスト】**

- **Content-Type**: `application/json`
- **Header**:

  - `Authorization: Bearer <Firebase ID Token>`
  - `X-CSRFToken: <CSRF Token>`

- **Body**:

```json
{
  "email": "string",
  "username": "string"
}
```

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `201 Created`
  - **Body**:

  ```json
  {
    "message": "User created successfully",
    "user_id": "integer"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "Email already exists"
  }
  ```

  ```json
  {
    "error": "Username already exists"
  }
  ```

  ```json
  {
    "error": "Email mismatch"
  }
  ```

#### 1-2. 認証済みユーザー情報の取得 `GET /api/auth/user/`

**【リクエスト】**

- **Header**:
  - `Authorization: Bearer <Firebase ID Token>`

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "user_id": "integer",
    "username": "string",
    "email": "string",
    "role": "string"
  }
  ```

- **失敗**:

  - **ステータスコード**: `401 Unauthorized`
  - **Body**:

  ```json
  {
    "error": "Invalid token"
  }
  ```

  ```json
  {
    "error": "Authentication failed"
  }
  ```

---

### 2. ごみ解析関連

#### 2-1. ごみ袋情報のアップロード `POST /api/garbage/garbage-bags/upload/`

**【リクエスト】**

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image` (file): アップロードする画像ファイル。
  - `user_id` (string): ユーザーの ID。
  - `tourist_spot_id` (integer): 観光地の ID。

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `201 Created`
  - **Body**:

  ```json
  {
    "success": true,
    "id": "integer",
    "status": "string",
    "points": "integer"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "User ID not provided"
  }
  ```

  ```json
  {
    "error": "Tourist Spot ID not provided"
  }
  ```

  ```json
  {
    "error": "Image not uploaded"
  }
  ```

  - **ステータスコード**: `500 Internal Server Error`
  - **Body**:

  ```json
  {
    "error": "Google Vision API call failed"
  }
  ```

---

#### 2-2. ユーザーのスタンプ情報の取得 `GET /api/garbage/user-stamps/`

**【リクエスト】**

- **Header**:
  - `Authorization: Bearer <Firebase ID Token>`

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "stamps": [
      {
        "tourist_spot_id": "integer",
        "date": "string",
        "points": "integer"
      }
    ],
    "total_points": "integer"
  }
  ```

- **失敗**:
  - **ステータスコード**: `401 Unauthorized`
  - **Body**:
  ```json
  {
    "error": "User not authenticated"
  }
  ```

---

#### 2-3. 最新のごみ袋情報の取得 `GET /api/garbage/garbage-bag/latest/`

**【リクエスト】**

- **Header**:
  - `Authorization: Bearer <Firebase ID Token>`

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "id": "integer",
    "status": "string",
    "points": "integer"
  }
  ```

- **失敗**:
  - **ステータスコード**: `404 Not Found`
  - **Body**:
  ```json
  {
    "error": "No garbage bag data found"
  }
  ```

---

### 3. 決済関連

#### 3-1. サブスクリプション決済の作成 `POST /api/payments/create-subscription/`

**【リクエスト】**

- **Content-Type**: `application/json`
- **Header**:

  - `X-CSRFToken: <CSRF Token>`

- **Body**:

```json
{
  "user_id": "integer"
}
```

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "url": "string"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "User ID not provided"
  }
  ```

  ```json
  {
    "error": "Stripe session creation failed"
  }
  ```

---

#### 3-2. 都度払い決済の作成 `POST /api/payments/create-one-time-payment/`

**【リクエスト】**

- **Content-Type**: `application/json`
- **Header**:

  - `X-CSRFToken: <CSRF Token>`

- **Body**:

```json
{
  "user_id": "integer",
  "is_participating": "boolean",
  "reservation_date": "string"
}
```

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "url": "string"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "User ID not provided"
  }
  ```

  ```json
  {
    "error": "Reservation date not provided"
  }
  ```

  ```json
  {
    "error": "Stripe session creation failed"
  }
  ```

---

#### 3-3. Stripe Webhook 受信エンドポイント `POST /api/payments/stripe-webhook/`

**【リクエスト】**

- **Header**:

  - `Stripe-Signature: <Stripe Webhook Signature>`

- **Body**: Stripe が自動送信する Webhook イベントペイロード。

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "message": "Webhook processed successfully"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "Invalid payload"
  }
  ```

  ```json
  {
    "error": "Signature verification failed"
  }
  ```

---

### 4. 観光地関連

#### 4-1. 観光地一覧の取得 `GET /api/tourist-spots/`

**【リクエスト】**

- **Header**:
  - `Authorization: Bearer <Firebase ID Token>`

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "tourist_spots": [
      {
        "id": "integer",
        "name": "string",
        "entry_fee": "integer",
        "operator_id": "integer"
      }
    ]
  }
  ```

- **失敗**:
  - **ステータスコード**: `401 Unauthorized`
  - **Body**:
  ```json
  {
    "error": "User not authenticated"
  }
  ```

---

#### 4-2. 新しい観光地の登録 `POST /api/tourist-spots/`

**【リクエスト】**

- **Content-Type**: `application/json`
- **Header**:

  - `Authorization: Bearer <Firebase ID Token>`
  - `X-CSRFToken: <CSRF Token>`

- **Body**:

```json
{
  "name": "string",
  "entry_fee": "integer",
  "operator_id": "integer"
}
```

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `201 Created`
  - **Body**:

  ```json
  {
    "id": "integer",
    "message": "Tourist spot created successfully"
  }
  ```

- **失敗**:

  - **ステータスコード**: `400 Bad Request`
  - **Body**:

  ```json
  {
    "error": "Name not provided"
  }
  ```

  ```json
  {
    "error": "Entry fee not provided"
  }
  ```

---

### 5. CSRF トークン関連

#### 5-1. CSRF トークンの取得 `GET /api/csrf-token/`

**【リクエスト】**

- **Header**:
  - `Accept: application/json`

**【レスポンス】**

- **成功**:

  - **ステータスコード**: `200 OK`
  - **Body**:

  ```json
  {
    "csrfToken": "string"
  }
  ```

- **失敗**:
  - **ステータスコード**: `500 Internal Server Error`
  - **Body**:
  ```json
  {
    "error": "CSRF token generation failed"
  }
  ```
