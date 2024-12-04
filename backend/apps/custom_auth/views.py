from rest_framework.views import APIView
from rest_framework.response import Response
from firebase_admin import auth
from .models import User


class CreateUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role", "user")

        try:
            firebase_user = auth.create_user(email=email, password=password)
            user = User.objects.create(
                username=firebase_user.uid, email=email, role=role
            )
            return Response({"message": "User created successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
