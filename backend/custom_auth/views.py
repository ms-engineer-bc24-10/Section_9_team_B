from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth
from .models import User


class SignUpView(APIView):
    def post(self, request):
        try:
            # Firebaseトークンを検証
            id_token = request.headers.get("Authorization").split("Bearer ")[1]
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token["uid"]
            email = decoded_token["email"]

            # ユーザーをDjangoデータベースに作成または取得
            user, created = User.objects.get_or_create(
                username=uid, defaults={"email": email, "role": "user"}
            )

            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        except ValueError as e:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
