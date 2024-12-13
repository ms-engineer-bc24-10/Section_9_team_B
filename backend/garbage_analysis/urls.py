from django.urls import path
from .views import GarbageBagUploadView, UserStampsView, LatestGarbageBagView

urlpatterns = [
    path(
        "garbage-bags/upload/",
        GarbageBagUploadView.as_view(),
        name="garbage-bag-upload",
    ),
    path("user-stamps/", UserStampsView.as_view(), name="user-stamps"),
    path(
        "api/garbage-bag/latest/",
        LatestGarbageBagView.as_view(),
        name="latest-garbage-bag",
    ),
]
