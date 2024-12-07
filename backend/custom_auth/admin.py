from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "firebase_uid")  # 表示したいフィールド
    search_fields = ("username", "email")  # 検索可能なフィールド
    list_filter = ("role",)  # フィルタリング可能なフィールド
    ordering = ("username",)  # デフォルトの並び順


# Userモデルを管理サイトに登録
admin.site.register(User, UserAdmin)
