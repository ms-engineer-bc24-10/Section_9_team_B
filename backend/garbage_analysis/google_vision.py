from google.cloud import vision
import os


def analyze_garbage(image_path, user_height_cm=None):
    """
    画像からゴミの大きさを計測する。
    体の大きさ（肩幅）を基準に、ゴミの幅(cm)、高さ(cm)、面積(cm²)を数値化し、ポイントを計算する。

    Args:
        image_path (str): 画像ファイルのパス
        user_height_cm (float, optional): ユーザーの身長(cm) (ない場合は、体の横幅を基準とする)

    Returns:
        dict: ゴミの大きさ（幅、高さ、面積、ポイント）を含む辞書
    """
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS"
    )
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # 1️⃣ 体（person）の検出
    object_response = client.object_localization(image=image)
    objects = object_response.localized_object_annotations

    body_bbox = None
    for obj in objects:
        if obj.name.lower() in ["person", "body", "human body"]:
            vertices = obj.bounding_poly.normalized_vertices
            x_min = min([v.x for v in vertices])
            x_max = max([v.x for v in vertices])
            y_min = min([v.y for v in vertices])
            y_max = max([v.y for v in vertices])
            body_bbox = {"x_min": x_min, "x_max": x_max, "y_min": y_min, "y_max": y_max}
            print(f"体の検出に成功しました: {body_bbox}")
            break

    if body_bbox is None:
        print("体が検出されませんでした。")
        return None

    # 体の横幅 (肩幅) の測定
    body_width = body_bbox["x_max"] - body_bbox["x_min"]

    # ユーザーの身長から肩幅を推定（身長の25%が肩幅）
    if user_height_cm:
        actual_body_width_cm = user_height_cm * 0.25
    else:
        actual_body_width_cm = 38  # yukki肩幅を仮定

    print(f"体の横幅 (ピクセル割合): {body_width}")
    print(f"実際の体の横幅 (cm): {actual_body_width_cm}")

    # 2️⃣ ゴミのラベル検出
    label_response = client.label_detection(image=image)
    labels = [label.description.lower() for label in label_response.label_annotations]
    print("ラベル検出結果:", labels)

    # ゴミ関連のラベルが含まれているか判定
    garbage_keywords = [
        "trash",
        "garbage",
        "litter",
        "waste",
        "recycling",
        "debris",
        "bottle",
        "plastic bottle",
        "pet bottle",
        "can",
        "aluminum can",
        "glass bottle",
        "paper",
        "cardboard",
        "plastic bag",
        "metal",
        "wrapper",
        "packaging",
        "snack wrapper",
        "small object",
        "tin can",
        "steel can",
        "bag",
        "shopping bag",
        "trash bag",
        "garbage bag",
        "vinyl bag",
        "pouch",
        "sack",
    ]

    detected_garbage_labels = [label for label in labels if label in garbage_keywords]
    if detected_garbage_labels:
        print(f"検出されたゴミの種類: {detected_garbage_labels}")
    else:
        print("ゴミ関連のラベルが検出されませんでした。")

    # 3️⃣ ゴミの検出（オブジェクトの位置を特定）
    garbage_bbox = None
    for obj in objects:
        if obj.name.lower() in garbage_keywords:
            vertices = obj.bounding_poly.normalized_vertices
            x_min = min([v.x for v in vertices])
            x_max = max([v.x for v in vertices])
            y_min = min([v.y for v in vertices])
            y_max = max([v.y for v in vertices])
            garbage_bbox = {
                "x_min": x_min,
                "x_max": x_max,
                "y_min": y_min,
                "y_max": y_max,
            }
            print(f"ゴミの検出に成功しました: {garbage_bbox}")
            break

    if garbage_bbox is None:
        print("ゴミが検出されませんでした。")
        return None

    # 4️⃣ ゴミの大きさを計算
    garbage_width = garbage_bbox["x_max"] - garbage_bbox["x_min"]
    garbage_height = garbage_bbox["y_max"] - garbage_bbox["y_min"]

    # ゴミの幅と高さを**体の幅（肩幅）を基準**に計算
    garbage_width_cm = (garbage_width / body_width) * actual_body_width_cm
    garbage_height_cm = (garbage_height / body_width) * actual_body_width_cm
    garbage_area_cm2 = garbage_width_cm * garbage_height_cm

    # 5️⃣ ポイントの計算 (1cm² = 0.1ポイント)
    points = garbage_area_cm2 * 0.1

    print(f"ゴミの幅: {garbage_width_cm:.2f} cm")
    print(f"ゴミの高さ: {garbage_height_cm:.2f} cm")
    print(f"ゴミの面積: {garbage_area_cm2:.2f} cm²")
    print(f"ポイント獲得: {points:.2f} ポイント")

    return {
        "garbage_width_cm": garbage_width_cm,
        "garbage_height_cm": garbage_height_cm,
        "garbage_area_cm2": garbage_area_cm2,
        "points": points,
        "detected_labels": detected_garbage_labels,
    }
