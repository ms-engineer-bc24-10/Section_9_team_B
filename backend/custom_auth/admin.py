from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "firebase_uid",
        "auth_method",
        "oauth_provider",
        "created_at",
        "updated_at",
    )  # 表示したいフィールド
    search_fields = ("username", "email")  # 検索可能なフィールド
    list_filter = ("role",)  # フィルタリング可能なフィールド
    ordering = ("id",)  # デフォルトの並び順


# Userモデルを管理サイトに登録
admin.site.register(User, UserAdmin)
