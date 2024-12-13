from django.contrib import admin
from .models import GarbageBag


@admin.register(GarbageBag)
class GarbageBagAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "tourist_spot",
        "status",
        "points",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "tourist_spot")
    search_fields = ("user__username", "tourist_spot__name")
    readonly_fields = ("updated_at",)
    fieldsets = (
        (None, {"fields": ("user", "tourist_spot", "status", "points")}),
        ("画像情報", {"fields": ("image_path", "width_cm", "height_cm", "area_cm2")}),
        ("タイムスタンプ", {"fields": ("created_at", "updated_at")}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "tourist_spot")
