from django.db import models
from django.conf import settings
from django.utils.timezone import now


class GarbageBag(models.Model):
    """
    ユーザーがアップロードしたゴミ袋の情報を管理するテーブル
    """

    STATUS_CHOICES = [
        ("issued", "Issued"),  # 発行済
        ("returned", "Returned"),  # 返却済
        ("verified", "Verified"),  # 確認済
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # settings.pyで指定されているAUTH_USER_MODEL = "custom_auth.User"を参照
        on_delete=models.CASCADE,
        related_name="garbage_bags",
        verbose_name="ユーザー",
    )
    tourist_spot = models.ForeignKey(
        "tourist_spots.TouristSpot",
        on_delete=models.CASCADE,
        related_name="garbage_bags",
        verbose_name="観光地",
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="issued",
        verbose_name="ステータス",
    )
    image_path = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="画像パス"
    )
    points = models.FloatField(default=0.0, verbose_name="ポイント")
    width_cm = models.FloatField(default=0.0, verbose_name="幅（cm）")
    height_cm = models.FloatField(default=0.0, verbose_name="高さ（cm）")
    area_cm2 = models.FloatField(default=0.0, verbose_name="面積（cm²）")
    created_at = models.DateTimeField(default=now, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")

    class Meta:
        verbose_name = "ゴミ袋"
        verbose_name_plural = "ゴミ袋"

    def __str__(self):
        """管理画面で表示する文字列"""
        return f"User: {self.user.username}, TouristSpotID: {self.tourist_spot_id}, Points: {self.points}"

    def get_points_message(self):
        """獲得ポイントのメッセージを生成"""
        return f"🎉 {self.points} ポイント獲得！ 🎉"  # NOTE:再利用性が高いためこの場所に記入
