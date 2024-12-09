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
from django.contrib.auth import login, authenticate

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
                username = email.split("@")[0]

            if email != firebase_email:
                return JsonResponse(
                    {"error": "Email mismatch"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        "username": username,
                        "firebase_uid": firebase_uid,
                        "role": "user",
                    },
                )

                if not created:
                    user.firebase_uid = firebase_uid
                    user.username = username
                    user.save()

            user.backend = "custom_auth.authentication.FirebaseAuthentication"
            login(request, user)

            # トランザクション外でセッション操作を行う
            login(request, user)
            request.session["user_id"] = user.id
            request.session.save()  # セッションを明示的に保存

            message = (
                "User created successfully" if created else "User updated successfully"
            )

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


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            request.session["user_id"] = user.id
            request.session.save()
            return JsonResponse({"message": "===ログイン成功===", "user_id": user.id})
        else:
            return JsonResponse(
                {"error": "===ログイン失敗==="}, status=status.HTTP_401_UNAUTHORIZED
            )


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return JsonResponse(
            {
                "message": "===認証済みユーザーのみアクセス可能===",
                "user_id": request.user.id,
            }
        )
