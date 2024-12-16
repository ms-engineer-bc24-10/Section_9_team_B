from django.db import models
from django.conf import settings  # NOTE: settings.pyのAUTH_USER_MODELを参照するため
from django.utils.timezone import now

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # settings.pyで指定されているAUTH_USER_MODEL = "custom_auth.User"を参照
        on_delete=models.CASCADE,
        related_name='transactions',
        verbose_name='ユーザー'
    )
    tourist_spot = models.ForeignKey(
        'tourist_spots.TouristSpot',
        on_delete=models.CASCADE,
        related_name='transactions',
        verbose_name='観光地'
    )
    amount = models.PositiveIntegerField(verbose_name='支払い金額')
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='paid',
        verbose_name='ステータス'
    )
    is_participating = models.BooleanField(default=False, verbose_name='ごみ拾い参加フラグ')
    stripe_session_id = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='StripeセッションID'
    )
    reservation_date = models.DateField(
        blank=True,
        null=True, # NOTE: reservation_dateをモデルに追加する以前の古いデータはこのフィールドにNULLが入る。NULLを許容しておかないとマイグレーションエラーを起こすのでTrueとする。
        verbose_name='予約日'
    )
    created_at = models.DateTimeField(default=now, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')

    class Meta:
        verbose_name = '取引'
        verbose_name_plural = '取引'
