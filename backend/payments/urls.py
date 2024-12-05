from django.urls import path
from .views import create_subscription, create_one_time_payment

urlpatterns = [
    path('create-subscription/', create_subscription, name='create-subscription'),
    path('create-one-time-payment/', create_one_time_payment, name='create-one-time-payment'),
]
