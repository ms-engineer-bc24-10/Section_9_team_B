# NOTE: serviceAccountKey.jsonが読み込めているか確認するためのテストファイルです
# python firebase_test.py を実行して
# Firebase Admin initialized successfully. と表示されれば読込できています

import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials

# プロジェクトのベースディレクトリを設定
BASE_DIR = Path(__file__).resolve().parent  # 現在のファイルがあるディレクトリ

# サービスアカウントキーのパスを指定（1つ上の階層にある場合）
cred = credentials.Certificate(
    os.path.join(BASE_DIR, "serviceAccountKey.json")
)  # 親ディレクトリのパスを指定
firebase_admin.initialize_app(cred)

print("Firebase Admin initialized successfully.")
