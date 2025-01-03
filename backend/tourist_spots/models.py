from django.db import models
from django.conf import settings  # NOTE: settings.pyのAUTH_USER_MODELを参照するため

class TouristSpot(models.Model):
    name = models.CharField(max_length=255, verbose_name="観光地の名前")
    entry_fee = models.PositiveIntegerField(verbose_name="入場料")
    operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_tourist_spots",
        verbose_name="観光地運営者ユーザー",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")

    class Meta:
        verbose_name = "観光地"
        verbose_name_plural = "観光地"
