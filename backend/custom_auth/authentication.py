import logging
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth

logger = logging.getLogger(__name__)


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            logger.debug("No Authorization header found")
            return None

        try:
            id_token = auth_header.split(" ").pop()
            logger.debug(f"Attempting to verify token: {id_token[:10]}...")
            decoded_token = auth.verify_id_token(id_token)
            logger.debug(f"Token verified successfully. Decoded token: {decoded_token}")
            uid = decoded_token["uid"]
            user, created = get_user_model().objects.get_or_create(
                email=decoded_token["email"],  # メールアドレスを使用
                defaults={"firebase_uid": uid},  # UIDをデフォルト値として使用
            )

            # ユーザー認証時のバックエンドの指定
            user.backend = "custom_auth.authentication.FirebaseAuthentication"

            logger.info(f"User authenticated: {user.username}")
            return (user, None)
        except auth.InvalidIdTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            raise exceptions.AuthenticationFailed("Invalid token")
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise exceptions.AuthenticationFailed("Authentication failed")
