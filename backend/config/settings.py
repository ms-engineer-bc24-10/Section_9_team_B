import os
from pathlib import Path
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
from decouple import config
from google.oauth2 import service_account


BASE_DIR = Path(__file__).resolve().parent.parent

# Firebase Admin SDKの初期化
# serviceAccountKey.jsonファイルのパスを指定
cred = credentials.Certificate(os.path.join(BASE_DIR, "serviceAccountKey.json"))
firebase_admin.initialize_app(cred)

# .envファイルのパスを指定
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path)

SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "custom_auth",
    "garbage_analysis",
  	"payments",
    "corsheaders",
    "tourist_spots",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": "localhost",
        "PORT": "5432",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "ja"

TIME_ZONE = "Asia/Tokyo"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST_FRAMEWORKの設定
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "custom_auth.authentication.FirebaseAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
}

# Firebase用カスタムユーザーモデルの作成
AUTH_USER_MODEL = "custom_auth.User"

# 認証バックエンドの設定
AUTHENTICATION_BACKENDS = [
    "custom_auth.authentication.FirebaseAuthentication",
    "django.contrib.auth.backends.ModelBackend",
]

# CORSの設定

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = (
    True  # NOTE: 開発環境でのみ使用。本番環境では特定のオリジンのみを許可すること。
)

CORS_ALLOW_CREDENTIALS = True

# HTTP メソッドを制限する場合
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# CSRFの設定

CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

CSRF_COOKIE_SECURE = False  # 開発環境ではFalse、本番環境ではTrue

CSRF_COOKIE_HTTPONLY = False

CSRF_USE_SESSIONS = False

CSRF_COOKIE_SAMESITE = "Lax"

# デバッグ用ログ設定
if DEBUG:
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
            },
        },
        "root": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    }

APPEND_SLASH = True

# 環境変数からGoogle Vision APIキーのパスを取得
GOOGLE_CREDENTIALS_PATH = os.path.join(BASE_DIR, "google_vision_key.json")

# Google Vision API 用の認証設定
try:
    cred = service_account.Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH
    )
    print("Google Vision API 認証情報が正常に読み込まれました。")
except Exception as e:
    cred = None
    print(f"Google Vision API 認証情報の読み込みに失敗しました: {e}")

# Google Cloud ライブラリが使用する環境変数に設定
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_CREDENTIALS_PATH


# Stripe API
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")
