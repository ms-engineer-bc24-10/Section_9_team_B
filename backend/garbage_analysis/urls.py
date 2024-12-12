from django.urls import path
from .views import GarbageBagUploadView, UserStampsView

urlpatterns = [
    path(
        "garbage-bags/upload/",
        GarbageBagUploadView.as_view(),
        name="garbage-bag-upload",
    ),
    path("user-stamps/", UserStampsView.as_view(), name="user-stamps"),
]
