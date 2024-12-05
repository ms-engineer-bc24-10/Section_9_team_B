from google.cloud import vision
import os


def analyze_garbage(image_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS"
    )
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # ラベル検出
    label_response = client.label_detection(image=image)
    labels = [label.description.lower() for label in label_response.label_annotations]
    print("ラベル検出結果:", labels)

    # ゴミ関連のラベルが含まれているか判定
    garbage_keywords = ["trash", "garbage", "litter", "waste", "recycling", "debris"]
    if any(keyword in labels for keyword in garbage_keywords):
        print("ゴミ関連のラベルが検出されました。")
        return True

    # オブジェクト検出 (補足的利用)
    object_response = client.object_localization(image=image)
    objects = [obj.name.lower() for obj in object_response.localized_object_annotations]
    print("オブジェクト検出結果:", objects)

    if any(keyword in objects for keyword in garbage_keywords):
        print("ゴミ関連のオブジェクトが検出されました。")
        return True

    print("ゴミとして判定されませんでした。")
    return False
