from django.urls import path
from .views import SignUpView, LoginView, ProtectedView
from .apis import CSRFTokenView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("api/csrf-token/", CSRFTokenView.as_view(), name="csrf_token"),
    path("login/", LoginView.as_view(), name="login"),
    path("protected/", ProtectedView.as_view(), name="protected"),
]
