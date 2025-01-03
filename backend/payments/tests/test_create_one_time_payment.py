import pytest
from django.urls import reverse


# TCS2-01: 正常なリクエスト
@pytest.mark.django_db
def test_create_one_time_payment_success(client):
    data = {
        "user_id": "12345",
        "reservation_date": "2024-12-31"
    }

    response = client.post(
        reverse("create-one-time-payment"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 200
    json_response = response.json()
    assert "url" in json_response
    assert json_response["url"].startswith("https://checkout.stripe.com")


# TCS2-02: `user_id`が空
@pytest.mark.django_db
def test_create_one_time_payment_user_id_empty(client):
    data = {
        "user_id": "",
        "reservation_date": "2024-12-31"
    }

    response = client.post(
        reverse("create-one-time-payment"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 400
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "user_id が含まれていません。"


# TCS2-03: `reservation_date`が空
@pytest.mark.django_db
def test_create_one_time_payment_reservation_date_empty(client):
    data = {
        "user_id": "12345",
        "reservation_date": ""
    }

    response = client.post(
        reverse("create-one-time-payment"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 400
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "予約日 が含まれていません。"


# TCS2-04: リクエストメソッドが `POST`以外
@pytest.mark.django_db
def test_create_one_time_payment_invalid_method(client):
    response = client.get(
        reverse("create-one-time-payment"),
        content_type="application/json"
    )

    assert response.status_code == 405
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "Invalid request method."


# TCS2-05: Stripe API エラー
@pytest.mark.django_db
def test_create_one_time_payment_stripe_api_error(client, monkeypatch):
    def mock_stripe_create(*args, **kwargs):
        raise Exception("Stripe API Error")
    
    import stripe
    monkeypatch.setattr(stripe.checkout.Session, "create", mock_stripe_create)

    data = {
        "user_id": "12345",
        "reservation_date": "2024-12-31"
    }

    response = client.post(
        reverse("create-one-time-payment"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 400
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "Stripe API Error"


# TCS2-06: `is_participating`が指定されない場合
@pytest.mark.django_db
def test_create_one_time_payment_is_participating_not_provided(client):
    data = {
        "user_id": "12345",
        "reservation_date": "2024-12-31"
    }

    response = client.post(
        reverse("create-one-time-payment"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 200
    json_response = response.json()
    assert "url" in json_response
    assert json_response["url"].startswith("https://checkout.stripe.com")
