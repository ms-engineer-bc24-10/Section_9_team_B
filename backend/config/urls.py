from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = request.COOKIES.get("csrftoken", "None")
    logger.info(f"CSRFトークンをクッキーにセット: {csrf_token}")
    return JsonResponse({"csrfToken": csrf_token})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("custom_auth.urls")),
    path("api/csrf-token/", get_csrf_token, name="csrf_token"),
    # garbage_analysis アプリのルーティングを登録
    path("", include("garbage_analysis.urls")),
    path("api/garbage/", include("garbage_analysis.urls")),
    path("payments/", include("payments.urls")),
]
