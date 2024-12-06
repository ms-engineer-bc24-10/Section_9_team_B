import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from firebase_admin import auth as firebase_auth
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug(f"Request headers: {request.headers}")
        logger.debug(f"Request body: {request.data}")
        print(f"===api呼び出し===")
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
            uid = decoded_token["uid"]
            firebase_email = decoded_token["email"]
            username = request.data.get("username")
            email = request.data.get("email")

            # Firebase のメールアドレスと入力されたメールアドレスが一致するか確認
            if email != firebase_email:
                return JsonResponse(
                    {"error": "Email mismatch"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            logger.debug(email)

            # ユーザーをDjangoデータベースに作成または取得
            try:
                user = User.objects.create_user(
                    username=username, email=email, firebase_uid=uid, role="user"
                )
                return JsonResponse(
                    {"message": "User created successfully", "user_id": user.id},
                    status=status.HTTP_201_CREATED,
                )
            except IntegrityError:
                return JsonResponse(
                    {"error": "Username or email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValueError as e:
            logger.error(f"Invalid token: {str(e)}")
            return JsonResponse(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
