import pytest
from django.urls import reverse


# TCS1-01: 正常なリクエスト
@pytest.mark.django_db
def test_create_subscription_success(client, settings):
    settings.STRIPE_API_BASE = "https://api.stripe.com"

    data = {
        "user_id": "12345"
    }

    response = client.post(
        reverse("create-subscription"),
        data,
        content_type="application/json"
    )

    assert response.status_code == 200
    json_response = response.json()
    assert "url" in json_response
    assert json_response["url"].startswith("https://checkout.stripe.com")


# TCS1-02: `user_id`が空
@pytest.mark.django_db
def test_create_subscription_user_id_empty(client):
    data = {
        "user_id": ""
    }

    response = client.post(
        "/payments/create-subscription/",
        data,
        content_type="application/json"
    )

    assert response.status_code == 400
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "Invalid parameters"


# TCS1-03: リクエストメソッドが`POST`以外
@pytest.mark.django_db
def test_create_subscription_invalid_method(client):
    response = client.get(
        "/payments/create-subscription/",
        content_type="application/json"
    )

    assert response.status_code == 405
    json_response = response.json()
    assert "error" in json_response
    assert json_response["error"] == "Invalid request method."


#TCS1-04: Stripe API エラー
@pytest.mark.django_db
def test_create_subscription_stripe_api_error(client, settings):
    settings.STRIPE_API_BASE = "http://localhost:12111"

    data = {
        "user_id": "12345"
    }

    response = client.post(
        "/payments/create-subscription/",
        data={"invalid_param": "test"},
        content_type="application/json"
    )

    assert response.status_code == 400
    json_response = response.json()
    assert "error" in json_response
    assert "Invalid parameters" in json_response["error"]
