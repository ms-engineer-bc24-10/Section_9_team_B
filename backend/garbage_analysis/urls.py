from django.urls import path
from .views import GarbageBagUploadView, UserBadgesView

urlpatterns = [
    path(
        "garbage-bags/upload/",
        GarbageBagUploadView.as_view(),
        name="garbage-bag-upload",
    ),
    path("user-badges/", UserBadgesView.as_view(), name="user-badges"),
]
