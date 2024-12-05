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
            email = decoded_token["email"]

            # ユーザーをDjangoデータベースに作成または取得
            user, created = User.objects.get_or_create(
                username=uid, defaults={"email": email, "role": "user"}
            )

            return JsonResponse(
                {"message": "User created successfully", "user_id": user.id},
                status=status.HTTP_201_CREATED,
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
