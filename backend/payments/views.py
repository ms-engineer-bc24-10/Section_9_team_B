import logging
import stripe
import os
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth.decorators import login_required
from payments.models import Transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction

logger = logging.getLogger(__name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


# @csrf_exempt  # NOTE: 外部リクエストが直接このエンドポイントを叩けるようにするデコレーター。CSRFトークンチェックを実装したのでコメントアウトする。


def create_subscription(request):
    """
    アプリ利用料（管理者→開発者）のサブスクリプションセッションを作成
    """
    stripe.api_base = settings.STRIPE_API_BASE
    logger.debug(f"Stripe API Base: {stripe.api_base}")

    if request.method == "POST":
        logger.info(f"POSTリクエストを受信: {request.path}")

        data = json.loads(request.body)

        user_id = data.get("user_id")
        if not user_id:
            return JsonResponse({"error": "Invalid parameters"}, status=400)
        logger.info(f"リクエストボディから受け取った user_id: {user_id}")

        try:
            csrf_token = request.META.get("HTTP_X_CSRFTOKEN", "None")
            logger.debug(f"リクエストヘッダーから受け取った CSRF トークン: {csrf_token}")
        except Exception as e:
            logger.error("CSRFトークン検証エラー", exc_info=True)

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
                    "user_id": str(
                        user_id
                    ),  # NOTE: メタデータにuser_idを追加することで、決済とユーザーを紐づける
                },
                success_url="http://localhost:3000/payment/success",  # Next.jsで作った成功時のページへリダイレクト
                cancel_url="http://localhost:3000/payment/cancel",  # Next.jsで作ったキャンセル時のページへリダイレクト
            )
            logger.debug(
                f"サブスクのStripe Session Metadata: {json.dumps(session.metadata, separators=(',', ':'))}"
            )  # NOTE: ログを1行で表示して読みやすくする
            return JsonResponse({"url": session.url})  # JSONでセッションURLを返す
        except Exception as e:
            logger.error("サブスク作成エラー", exc_info=True)
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


def create_one_time_payment(request):
    """
    入場料（来場者→管理者）の決済セッションを作成
    """
    stripe.api_base = settings.STRIPE_API_BASE
    logger.debug(f"Stripe API Base: {stripe.api_base}")

    if request.method == "POST":
        logger.info(f"POSTリクエストを受信: {request.path}")

        data = json.loads(request.body)

        user_id = data.get("user_id")
        logger.info(f"リクエストボディから受け取った user_id: {user_id}")
        if not user_id:
            return JsonResponse({"error": "user_id が含まれていません。"}, status=400)

        is_participating = data.get("is_participating", False)
        logger.info(f"リクエストボディから受け取った 参加フラグ: {is_participating}")

        reservation_date = data.get("reservation_date")
        logger.info(f"リクエストボディから受け取った 予約日: {reservation_date}")
        if not reservation_date:
            return JsonResponse({"error": "予約日 が含まれていません。"}, status=400)

        try:
            csrf_token = request.META.get("HTTP_X_CSRFTOKEN", "None")
            logger.debug(f"リクエストヘッダーから受け取った CSRF トークン: {csrf_token}")
        except Exception as e:
            logger.error("CSRFトークン検証エラー", exc_info=True)

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
                metadata={
                    "user_id": str(user_id),
                    "is_participating": str(is_participating).lower(),
                    "reservation_date": str(reservation_date),
                },
                
                success_url=f"http://localhost:3000/payment/success?user_id={user_id} &is_participating={is_participating}",  # ユーザー情報保持した状態でsuccessページへ遷移
                cancel_url="http://localhost:3000/payment/cancel",
            )
            logger.debug(
                f"都度払いのStripe Session Metadata: {json.dumps(session.metadata, separators=(',', ':'))}"
            )

            return JsonResponse({"url": session.url})
        except Exception as e:
            logger.error("都度払い作成エラー", exc_info=True)
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt  # NOTE: Stripe CLIからのWebhookはユーザーのブラウザを通さず直接リクエストを送ってくるため、CSRFトークンチェックは不要。
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
        logger.info(f"Webhook 受信したイベント: {event['type']}")
    except ValueError as e:
        # 無効なペイロード
        logger.error("Webhook 無効なペイロード", exc_info=True)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # 署名エラー
        logger.error("Webhook 署名エラー", exc_info=True)
        return HttpResponse(status=400)

    # イベントタイプごとに処理
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]  # Stripeセッションオブジェクト
        metadata = session.get("metadata", {})
        logger.debug(
            f"受信したメタデータ: {json.dumps(metadata, separators=(',', ':'))}"
        )

        # メタデータから必要な情報を取得
        user_id = metadata.get("user_id")
        is_participating = metadata.get("is_participating", "false").lower() == "true"
        reservation_date = metadata.get("reservation_date")

        amount = session["amount_total"]
        logger.info(f"支払い金額: {amount}円")

        # DBに登録
        try:
            transaction = Transaction.objects.create(
                user_id=user_id,
                tourist_spot_id=1,  # TODO 関連付けを追加
                amount=amount,
                status="paid",
                is_participating=is_participating,
                stripe_session_id=session["id"],
                reservation_date=reservation_date,
            )
            logger.info(f"取引をDB登録しました: {transaction}")
        except Exception as e:
            logger.error("取引のDB登録に失敗しました", exc_info=True)
            return HttpResponse(status=500)

    # 支払い失敗イベントを処理
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]  # Stripeのインボイスオブジェクト
        logger.info(f"Webhook 支払い失敗イベント: {event['type']}")
        logger.debug(f"支払い失敗インボイスID: {invoice['id']}")

    else:
        logger.info(f"Webhook 未対応のイベント: {event['type']}")

    return HttpResponse(status=200)


# 決済履歴一覧
class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = Transaction.objects.filter(user=user).order_by("-created_at")

        payment_history = [
            {
                "id": t.id,
                "date": t.created_at.strftime("%Y-%m-%d"),
                "amount": t.amount,
                "status": t.status,
            }
            for t in transactions
        ]

        return Response(payment_history)


# 決済履歴詳細
class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, transaction_id):
        try:
            transaction = Transaction.objects.get(id=transaction_id, user=request.user)
            detail = {
                "id": transaction.id,
                "date": transaction.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "amount": transaction.amount,
                "status": transaction.status,
                "tourist_spot": transaction.tourist_spot.name,
                "is_participating": transaction.is_participating,
                "stripe_session_id": transaction.stripe_session_id,
                "reservation_date": transaction.reservation_date.strftime("%Y-%m-%d"),
            }
            return Response(detail)
        except Transaction.DoesNotExist:
            return Response({"error": "詳細が見つかりません"}, status=404)
