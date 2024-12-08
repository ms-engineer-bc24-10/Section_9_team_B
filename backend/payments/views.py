import logging
import stripe
import os
import json  # JSONデータのパースに使用
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from payments.models import Transaction

logger = logging.getLogger(__name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@csrf_exempt  # NOTE: 外部リクエストが直接このエンドポイントを叩けるようにするデコレーター。CSRFトークンチェックをスキップする。開発環境だけ。
@login_required  # NOTE: 認証済みのユーザーだけがこのビューを利用できるようにするためのデコレーター。
def create_subscription(request):
    """
    アプリ利用料（管理者→開発者）のサブスクリプションセッションを作成
    """
    if request.method == "POST":
        user_id = request.user.id  # 認証済みのユーザーIDを取得
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
                metadata={
                    "user_id": str(user_id),  # メタデータにuser_idを追加
                },
                success_url="http://localhost:3000/payment/success",  # Next.jsで作った成功時のページへリダイレクト
                cancel_url="http://localhost:3000/payment/cancel",    # Next.jsで作ったキャンセル時のページへリダイレクト
            )
            logger.debug(f"サブスクのStripe Session Metadata: {session.metadata}")
            return JsonResponse({"url": session.url})  # JSONでセッションURLを返す
        except Exception as e:
            logger.error(f"サブスク作成エラー: {e}")
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt  # NOTE: 外部リクエストが直接このエンドポイントを叩けるようにするデコレーター。CSRFトークンチェックをスキップする。開発環境だけ。
@login_required  # NOTE: 認証済みのユーザーだけがこのビューを利用できるようにするためのデコレーター。
def create_one_time_payment(request):
    """
    入場料（来場者→管理者）の決済セッションを作成
    """
    if request.method == "POST":
        user_id = request.user.id  # 認証済みのユーザーIDを取得
        try:
            # フロントエンドからのJSONデータを取得
            data = json.loads(request.body)
            is_participating = data.get("is_participating", False)  # デフォルトはFalse

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
                metadata={
                    "user_id": str(user_id),  # メタデータにuser_idを追加
                    "is_participating": str(is_participating).lower(),  # メタデータにフラグを追加
                },
                success_url="http://localhost:3000/payment/success",
                cancel_url="http://localhost:3000/payment/cancel",
            )
            logger.debug(f"都度払いのStripe Session Metadata: {session.metadata}")

            return JsonResponse({"url": session.url})
        except Exception as e:
            logger.error(f"都度払い作成エラー: {e}")
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt  # NOTE: 外部リクエストが直接このエンドポイントを叩けるようにするデコレーター。CSRFトークンチェックをスキップする。開発環境だけ。
@login_required  # NOTE: 認証済みのユーザーだけがこのビューを利用できるようにするためのデコレーター。
def stripe_webhook(request):
    """
    Stripe Webhookエンドポイント
    """
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")  # Stripeの署名ヘッダー
    event = None

    try:
        # Webhookイベントを検証
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
        logger.debug(f"Webhook 受信したイベント: {event['type']}")
    except ValueError as e:
        # 無効なペイロード
        logger.error(f"Webhook 無効なペイロード: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # 署名エラー
        logger.error(f"Webhook 署名エラー: {e}")
        return HttpResponse(status=400)

    # イベントタイプごとに処理
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]  # Stripeセッションオブジェクト
        metadata = session.get("metadata", {})
        logger.debug(f"受信したメタデータ: {metadata}")

        # メタデータから必要な情報を取得
        user_id = metadata.get("user_id")
        is_participating = metadata.get("is_participating", "false") == "true"

        amount = session["amount_total"]  # 支払い金額（セント単位）

        # DBに登録
        try:
            transaction = Transaction.objects.create(
                user_id=user_id,
                tourist_spot_id=None,  # TODO 関連付けを追加
                amount=amount // 100,  # セント単位から円に変換
                status="paid",
                is_participating=is_participating,
                stripe_session_id=session["id"],
            )
            logger.info(f"取引をDB登録しました: {transaction}")
        except Exception as e:
            logger.error(f"取引のDB登録に失敗しました: {e}")
            return HttpResponse(status=500)

    return HttpResponse(status=200)
