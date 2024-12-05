# vision API 呼び出しロジックを記述
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
    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    for obj in objects:
        if obj.name.lower() in ["garbage", "trash"]:
            return True  # ゴミが含まれている場合
    return False
