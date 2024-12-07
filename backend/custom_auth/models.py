from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    ROLES = (
        ("user", "User"),
        ("operator", "Operator"),
    )
    role = models.CharField(max_length=10, choices=ROLES, default="user")
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "firebase_uid"]

    # ユーザー名のバリデータを上書き
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
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return (
            f"Username: {self.username}, UID: {self.firebase_uid}, Email: {self.email}"
        )
