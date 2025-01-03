import json
import pytest
import stripe
from django.urls import reverse
from django.contrib.auth import get_user_model
from tourist_spots.models import TouristSpot
from unittest.mock import patch


# TCS3-01: 正常な Webhook イベント
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
def test_stripe_webhook_success(mock_stripe_event, client):
    user = get_user_model().objects.create_user(
			username="testuser",
			email="testuser@example.com",
			password="password"
		)

    tourist_spot = TouristSpot.objects.create(
        name="観光地A",
        entry_fee=1000,
        operator=user
    )

    mock_event_data = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_example",
                "amount_total": 5000,
                "metadata": {
                    "user_id": "1",
                    "is_participating": "true",
                    "reservation_date": "2024-12-31"
                },
            }
        }
    }

    mock_stripe_event.return_value = mock_event_data

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 200


# TCS3-02: 不正なペイロード（metadataの不足）
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
def test_stripe_webhook_invalid_payload(mock_stripe_event, client):
    mock_event_data = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_example",
                "amount_total": 5000,
            }
        }
    }

    mock_stripe_event.side_effect = ValueError("Invalid payload")

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 400


# TCS3-03: 署名検証エラー
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
def test_stripe_webhook_signature_error(mock_stripe_event, client):
    mock_event_data = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_example",
                "amount_total": 5000,
                "metadata": {
                    "user_id": "1",
                    "is_participating": "true",
                    "reservation_date": "2024-12-31"
                },
            }
        }
    }

    mock_stripe_event.side_effect = stripe.error.SignatureVerificationError("Invalid signature", sig_header="signature-header")

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 400


# TCS3-04: データベース登録失敗
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
@patch("payments.models.Transaction.objects.create")
def test_stripe_webhook_database_error(mock_create_transaction, mock_stripe_event, client):
    mock_event_data = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_example",
                "amount_total": 5000,
                "metadata": {
                    "user_id": "1",
                    "is_participating": "true",
                    "reservation_date": "2024-12-31"
                },
            }
        }
    }

    mock_create_transaction.side_effect = Exception("Database error")

    mock_stripe_event.return_value = mock_event_data

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 500


# TCS3-05: 未対応の Webhook イベントを受信
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
@patch("payments.models.Transaction.objects.create")
def test_stripe_webhook_unsupported_event(mock_create, mock_stripe_event, client):
    mock_event_data = {
        "type": "checkout.session.failed",
        "data": {
            "object": {
                "id": "cs_test_example",
                "amount_total": 5000,
                "metadata": {
                    "user_id": "1",
                    "is_participating": "true",
                    "reservation_date": "2024-12-31"
                },
            }
        }
    }

    mock_stripe_event.return_value = mock_event_data

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 200
    mock_create.assert_not_called()


# TCS3-06: 支払い失敗イベント
@pytest.mark.django_db
@patch("payments.views.stripe.Webhook.construct_event")
@patch("payments.models.Transaction.objects.create")
def test_stripe_webhook_payment_failed(mock_create, mock_stripe_event, client):
    mock_event_data = {
        "type": "invoice.payment_failed",
        "data": {
            "object": {
                "id": "in_test_example",
                "amount_due": 5000,
                "metadata": {
                    "user_id": "1",
                    "reservation_date": "2024-12-31"
                },
            }
        }
    }

    mock_stripe_event.return_value = mock_event_data

    response = client.post(
        reverse("stripe-webhook"),
        data=json.dumps(mock_event_data),
        content_type="application/json"
    )

    assert response.status_code == 200
    mock_create.assert_not_called()
