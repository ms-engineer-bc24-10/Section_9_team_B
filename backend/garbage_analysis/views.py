from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import GarbageBag
from .google_vision import analyze_garbage


class GarbageBagUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        user = request.user
        tourist_spot_id = request.data.get("tourist_spot_id")
        image_file = request.FILES["image"]

        # 画像を一時保存
        file_path = f"/tmp/{image_file.name}"
        with open(file_path, "wb+") as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)

        # Google Vision API 呼び出し
        is_garbage = analyze_garbage(file_path)

        # モデル保存
        garbage_bag = GarbageBag.objects.create(
            user=user,
            tourist_spot_id=tourist_spot_id,
            status="verified" if is_garbage else "returned",
            image_path=file_path,
        )

        return Response({"id": garbage_bag.id, "status": garbage_bag.status})
