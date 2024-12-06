from django.urls import path
from .views import GarbageBagUploadView

urlpatterns = [
    path(
        "garbage-bags/upload/",
        GarbageBagUploadView.as_view(),
        name="garbage-bag-upload",
    ),
]
