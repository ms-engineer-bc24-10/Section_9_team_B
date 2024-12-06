import stripe
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@csrf_exempt  # NOTE: 外部リクエストが直接このエンドポイントを叩けるようにするデコレーター。CSRFトークンチェックをスキップする。開発環境だけ。
# @login_required  # TODO: 認証済みのユーザーだけがこのビューを利用できるようにするためのデコレーター。認証機能と繋げてコメントアウトを外す。
def create_subscription(request):
    """
    アプリ利用料（管理者→開発者）のサブスクリプションセッションを作成
    """
    if request.method == "POST":
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                line_items=[
                    {
                        "price_data": {
                            "currency": "jpy",
                            "recurring": {"interval": "month"},
                            "product_data": {"name": "アプリ利用料"},
                            "unit_amount": 5000,  # TODO: 小規模、中規模、大規模で金額を変更すべきかも
                        },
                        "quantity": 1,
                    },
                ],
                success_url="http://localhost:3000/payment/success",  # Next.jsで作った成功時のページへリダイレクト
                cancel_url="http://localhost:3000/payment/cancel",    # Next.jsで作ったキャンセル時のページへリダイレクト
            )
            return JsonResponse({"url": session.url})  # JSONでセッションURLを返す
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def create_one_time_payment(request):
    """
    入場料（来場者→管理者）の決済セッションを作成
    """
    if request.method == "POST":
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[
                    {
                        "price_data": {
                            "currency": "jpy",
                            "product_data": {"name": "入場料"},
                            "unit_amount": 2000,  # TODO: 観光地によって設定した金額にしたい
                    },
                        "quantity": 1,
                    },
                ],
                success_url="http://localhost:3000/payment/success",
                cancel_url="http://localhost:3000/payment/cancel",
            )
            return JsonResponse({"url": session.url})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)