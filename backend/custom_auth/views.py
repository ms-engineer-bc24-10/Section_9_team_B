import logging
import traceback
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from firebase_admin import auth as firebase_auth
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.db import IntegrityError, transaction

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug(f"Request headers: {request.headers}")
        logger.debug(f"Request body: {request.data}")
        logger.info("===api呼び出し===")

        try:
            # Firebaseトークンを検証
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return JsonResponse(
                    {"error": "No Authorization header"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            id_token = auth_header.split("Bearer ")[1]
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token["uid"]
            firebase_email = decoded_token["email"]
            username = request.data.get("username")
            email = request.data.get("email")

            # usernameのバリデーション
            if not username:
                # メールアドレスの@前の部分をデフォルトのユーザー名として使用
                username = email.split("@")[0]

            # Firebase のメールアドレスと入力されたメールアドレスが一致するか確認
            if email != firebase_email:
                return JsonResponse(
                    {"error": "Email mismatch"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                # メールアドレスでユーザーを検索
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        "username": username,
                        "firebase_uid": firebase_uid,
                        "role": "user",
                    },
                )

                if not created:
                    # 既存ユーザーの場合、Firebase UIDとユーザー名を更新
                    user.firebase_uid = firebase_uid
                    user.username = username
                    user.save()
                    message = "User updated successfully"
                else:
                    message = "User created successfully"

            # 操作結果のログ出力
            logger.info(f"User operation result: {message}")
            return JsonResponse(
                {"message": message, "user_id": user.id},
                status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED,
            )

        except IntegrityError as e:
            logger.error(f"IntegrityError: {str(e)}")
            if "email" in str(e):
                return JsonResponse(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif "username" in str(e):
                return JsonResponse(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return JsonResponse(
                    {"error": "User creation failed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except ValueError as e:
            logger.error(f"Invalid token: {str(e)}")
            return JsonResponse(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            logger.error(traceback.format_exc())
            return JsonResponse(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return JsonResponse(
            {
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
        )
