from django.urls import path
from .views import SignUpView, UserInfoView
from .apis import CSRFTokenView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("api/csrf-token/", CSRFTokenView.as_view(), name="csrf_token"),
    path("user/", UserInfoView.as_view(), name="user_info"),
]
