from django.db import models
from custom_auth.models import User  # NOTE:ユーザーモデルを外部キーに使用


class GarbageBag(models.Model):
    """
    ユーザーがアップロードしたゴミ袋の情報を管理するテーブル
    """

    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("returned", "Returned"),
        ("verified", "Verified"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="garbage_bags"
    )  # NOTE:カスタムユーザーとのリレーション
    tourist_spot_id = models.IntegerField()  # NOTE:外部の観光地IDを数値として保持
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    points = models.FloatField(default=0.0)
    width_cm = models.FloatField(default=0.0)
    height_cm = models.FloatField(default=0.0)
    area_cm2 = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User: {self.user.username}, TouristSpotID: {self.tourist_spot_id}, Points: {self.points}"

    def get_points_message(self):
        """獲得ポイントのメッセージを生成"""
        return f"🎉 {self.points} ポイント獲得！ 🎉"  # NOTE:再利用性が高いためこの場所に記入
