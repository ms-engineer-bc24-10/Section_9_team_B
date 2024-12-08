from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", None)  # スーパーユーザーにはロールを設定しない

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ("user", "User"),
        ("operator", "Operator"),
    )
    username_validator = RegexValidator(
        regex=r"^[\w.@+\-ぁ-んァ-ン一-龥]+$",
        message=_(
            "Enter a valid username. This value may contain only letters, "
            "numbers, and @/./+/-/_ characters."
        ),
    )

    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField(unique=True)
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLES, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"Username: {self.username}, UID: {self.firebase_uid}, Email: {self.email}, Role: {self.get_role_display()}"

    def is_web_app_user(self):
        return self.role in ["user", "operator"]

    def is_operator(self):
        return self.role == "operator"
