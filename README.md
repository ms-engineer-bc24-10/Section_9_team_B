## Section9 teamB プロジェクト用リポジトリ

### プロジェクト概要

▼ プロジェクトの目的  
自分の名言手帳アプリの作成

▼ アプリの説明  
日常を過ごす中で降ってわいた名言をエピソードと共に記録し、自分の新たな一面を発見したり、ここぞという時に使う為に名言を記録していくアプリ

▼ 機能一覧  
【ログイン画面】  
・ログイン認証機能  
・自分の名言手帳の PR

【メインページ】  
・自分の名言手帳作成エリア  
　 └ 名言入力欄  
　 └ 名言説明入力欄（名言の生い立ち・使いどころ）  
　 └ 名言にまつわる画像・イラスト等のファイルアップロード機能  
　 └ 偉人の名言とコラボ機能  
・偉人の名言ピックアップエリア（ページがロードされるたびランダム表示）

### 主要技術

| 言語・ツール | バージョン |
| ------------ | ---------- |
| TypeScript   | 5.6.3      |
| Next.js      | 15.0.3     |
| Firebase     | 11.0.1     |
| Python       | 3.11       |
| Django       | 5.1.3      |
| PostgreSQL   | 14.13      |
| Docker       | 27.2.0     |

### ディレクトリ構成

```
.
├── backend
│   ├── api
│   ├── backend
│   └── media
├── doc
└── frontend
│   ├── pages
│   ├── public
│   └── src
├──docker-compose.yml
└──README.md
```

### ディレクトリの役割

| ディレクトリ名   | 役割               |
| ---------------- | ------------------ |
| Section_7_team_A | ルートプロジェクト |
| frontend         | フロントエンド     |
| doc              | ドキュメント　 　  |
| backend          | バックエンド　 　  |

### 環境セットアップ方法

※プロジェクト名、コマンドなど適宜修正！！！！※

##### 1.xxxx プロジェクトの準備

ローカルにプロジェクト用のディレクトリを作成

ローカルのルートディレクトリに移動

```
cd "ディレクトリ名"
```

Section_7_team_A プロジェクトのクローンを作成

```
git clone Section_7_team_A
```

##### 2.Docker の設定

- Docker ファイルの設定

  backendディレクトリ、frontendディレクトリそれぞれにDockerfileがあることを確認

- compose.yml の設定

  プロジェクトルートにcompose.ymlがあることを確認

- 環境変数の設定
  compose.ymlと同じ階層に.envファイルを作成し、環境変数を記載する

##### 3.Docker の起動

compose.yml のあるディレクトリで Docker を起動

```
docker compose up
```

### Docker コマンド一覧

| コマンド 　                                            | 実行する処理                                          |
| ------------------------------------------------------ | ----------------------------------------------------- |
| docker start コンテナ ID または名前                    | Docker の停止                                         |
| docker-compose up --build                              | Docker の build+起動                                  |
| docker-compose up --build -d                           | Docker の build+起動+バックグラウンドで起動           |
| docker compose exec container_name php artisan migrate | Docker コンテナに入り migrate を実行 　　　　　　　　 |
| docker volume rm $(docker volume ls -qf dangling=true) | データボリュームの削除 　　　　　　　　　             |
| docker builder prune --all --force                     | Docker 全てのキャッシュの削除 　　　　　　　　　      |
| docker ps                                              | 現在起動しているコンテナを表示 　                     |

### コミットログ記載ルール

| プレフィックス | 説明                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| 【add】        | 新規ファイル・機能の追加                                               |
| 【fix】        | バグの修正やエラーの解決など、既存コードの問題を修正・編集             |
| 【update】     | 機能修正（バグではない） 　　　　　　　　　　　　　　　　　　　　　　  |
| 【clean】      | 整理（リファクタリング等）                                             |
| 【docs】       | ドキュメントの更新や追加（README、コメント、マニュアルなど）           |
| 【styles】     | コードの動作に影響しないスタイルの変更（インデント、フォーマットなど） |
| 【delete】     | 不要なコード、ファイル、機能の削除。クリーンアップ作業を含む           |
| 【upgrade】    | バージョンアップ                                                       |

### GitHub ブランチの命名規則

Name_TaskName 例）Hirona_setting

### GitHub でのプロジェクト管理方法

project 機能でタスク管理を行う(Todo・In Progress・Done)
Issues 機能で各種機能の追加を行う

### その他共有事項・参考資料など

開発を楽しみましょう！
