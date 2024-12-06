from django.urls import path
from .views import SignUpView
from .apis import CSRFTokenView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("api/csrf-token/", CSRFTokenView.as_view(), name="csrf_token"),
]
