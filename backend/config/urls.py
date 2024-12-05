from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"csrfToken": "token set in cookie"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("custom_auth.urls")),
    path("api/csrf-token/", get_csrf_token, name="csrf_token"),
]
