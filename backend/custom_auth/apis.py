from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token


class CSRFTokenView(APIView):
    def get(self, request):
        return Response({"csrfToken": get_token(request)})
