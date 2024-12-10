from django.contrib import admin
from .models import TouristSpot

@admin.register(TouristSpot)
class TouristSpotAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "entry_fee", "operator", "created_at", "updated_at")
    search_fields = ("name", "admin__username")
