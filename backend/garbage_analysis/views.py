from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import GarbageBag
from .google_vision import analyze_garbage


class GarbageBagUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            print("リクエストデータ:", request.data)
            print("ファイルデータ:", request.FILES)

            # ユーザーIDを取得（認証未実装の場合は仮IDを使用）
            user_id = (
                request.user.id if request.user.is_authenticated else 1
            )  # 仮のユーザーID

            tourist_spot_id = request.data.get("tourist_spot_id")
            if not tourist_spot_id:
                return Response({"error": "観光地IDが指定されていません。"}, status=400)

            if "image" not in request.FILES:
                return Response(
                    {"error": "画像がアップロードされていません。"}, status=400
                )

            image_file = request.FILES["image"]

            # NOTE:画像 /tmp/ディレクトリに一時保存
            file_path = f"/tmp/{image_file.name}"
            with open(file_path, "wb+") as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)

            print(f"一時ファイルに保存されました: {file_path}")

            # Google Vision API 呼び出し
            try:
                is_garbage = analyze_garbage(file_path)
                print("ゴミ判定結果:", is_garbage)
            except Exception as e:
                print("Google API エラー:", e)
                return Response(
                    {"error": "Google Vision API 呼び出しに失敗しました。"}, status=500
                )

            # モデル保存
            garbage_bag = GarbageBag.objects.create(
                user_id=user_id,
                tourist_spot_id=int(tourist_spot_id),
                status="verified" if is_garbage else "returned",
                image_path=file_path,
            )

            print("GarbageBag モデルが作成されました:", garbage_bag.id)

            return Response({"id": garbage_bag.id, "status": garbage_bag.status})

        except Exception as e:
            print("一般的なエラー:", e)
            return Response(
                {"error": "サーバー内部でエラーが発生しました。"}, status=500
            )
