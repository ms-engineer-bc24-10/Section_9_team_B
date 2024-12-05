from django.db import models


class GarbageBag(models.Model):
    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("returned", "Returned"),
        ("verified", "Verified"),
    ]
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    tourist_spot = models.ForeignKey("TouristSpot", on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
