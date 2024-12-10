from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'tourist_spot', 'amount', 'status', 'is_participating', 'stripe_session_id', 'created_at', 'updated_at')
    search_fields = ('user__name', 'stripe_session_id')
