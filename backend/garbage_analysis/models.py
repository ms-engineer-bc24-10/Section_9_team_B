from django.db import models


class GarbageBag(models.Model):
    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("returned", "Returned"),
        ("verified", "Verified"),
    ]
    user_id = models.BigIntegerField(null=True, blank=True)  # 仮のユーザーID
    tourist_spot_id = models.BigIntegerField(null=True, blank=True)  # 仮の観光地ID
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
