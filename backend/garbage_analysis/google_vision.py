from google.cloud import vision
import os


def analyze_garbage(image_path):
    """
    画像からゴミ袋およびその中身を分類し、ラベル情報を取得し、
    ゴミ袋の面積に基づいてポイントを計算する。
    """
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS"
    )

    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    # ゴミ関連のキーワード
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
        "plastic",
        "wrap",
        "packaging materials",
        "transparent bag",
        "bottle inside bag",
        "bottles in bag",
        "recycling bag",
        "bag with pet bottles",
        "container bag",
        "recyclable materials in bag",
        "bottle in bag",
        "cans in bag",
        "trash in bag",
        "garbage in bag",
        "recyclable items in bag",
        "transparent bag with bottles",
        "transparent bag with cans",
        "bag with garbage",
        "bag with trash",
        "bag with recyclables",
        "plastic bag with bottles",
        "plastic bag with cans",
        "bag with waste items",
        "vinyl bag with bottles",
        "vinyl bag with cans",
        "bag containing trash",
        "bag containing recyclables",
        "clear bag with bottles",
        "clear bag with cans",
        "trash bag with items",
        "garbage bag with bottles",
        "garbage bag with cans",
    ]

    # ラベル検出
    label_response = client.label_detection(image=image)
    raw_labels = [
        label.description.lower() for label in label_response.label_annotations
    ]
    print("検出されたラベル:", raw_labels)
    # ゴミ関連ラベルのフィルタリング
    detected_garbage_labels = [
        label for label in raw_labels if label in garbage_keywords
    ]
    if detected_garbage_labels:
        print(f"検出されたゴミの種類: {detected_garbage_labels}")
    else:
        print("ゴミ関連のラベルが検出されませんでした。")

    # オブジェクト検出
    object_response = client.object_localization(image=image)
    objects = object_response.localized_object_annotations

    garbage_objects = []
    for obj in objects:
        print(f"オブジェクトの名前: {obj.name}, スコア: {obj.score}")
        if obj.name.lower() in garbage_keywords:  # モックデータでも適用可能
            garbage_objects.append(obj.name.lower())

    # 箱の大きさを直接指定 (幅: 32.5cm, 高さ: 6.5cm)
    box_width_cm = 32.5
    box_height_cm = 6.5
    print(f"既知の箱のサイズ - 幅: {box_width_cm}cm, 高さ: {box_height_cm}cm")

    # ラベルとオブジェクトの組み合わせ評価
    if "bag" in raw_labels or any(
        bottle_keyword in raw_labels
        for bottle_keyword in [
            "bottle",
            "plastic bottle",
            "pet bottle",
            "container",
            "wrap",
        ]
    ):
        garbage_objects.append("bag with bottles")

    print("検出されたゴミオブジェクト:", garbage_objects)

    # ゴミ袋の判定を緩める
    is_garbage_bag_detected = False

    if "bag" in raw_labels or "plastic" in raw_labels:
        is_garbage_bag_detected = True
    if "bottle" in raw_labels and any("bag" in obj for obj in garbage_objects):
        is_garbage_bag_detected = True
    if any("bag" in obj for obj in garbage_objects):
        is_garbage_bag_detected = True
    if "plastic" in raw_labels and any("bottle" in obj for obj in garbage_objects):
        is_garbage_bag_detected = True

    if is_garbage_bag_detected:
        print("ゴミ袋を検出できました！")

    # BoundingBoxを利用したゴミ袋サイズ推定 (cm² で表示)
    estimated_bag_area = 0
    area_cm2 = 0  # 初期化

    if is_garbage_bag_detected:  # ゴミ袋が検出された場合にのみ面積を計算
        for obj in objects:
            vertices = obj.bounding_poly.normalized_vertices
            if len(vertices) >= 4:
                width = abs(vertices[1].x - vertices[0].x) * box_width_cm
                known_width_ratio = box_width_cm / abs(vertices[1].x - vertices[0].x)
                height = abs(vertices[2].y - vertices[0].y) * known_width_ratio
                area_cm2 = width * height
                print(
                    f"ゴミ袋のBoundingBoxの幅: {width}cm, 高さ: {height}cm, 面積: {area_cm2}cm²"
                )
                estimated_bag_area = max(estimated_bag_area, area_cm2)

    points = round(estimated_bag_area)
    print(f"獲得ポイント: {points}ポイント")

    return {
        "labels": detected_garbage_labels,
        "objects": garbage_objects,
        "raw_labels": raw_labels,
        "garbage_bag_detected": is_garbage_bag_detected,
        "bag_area_cm2": area_cm2,
        "points": points,
        "garbage_dimensions_cm": {"width": width, "height": height},
        "box_dimensions_cm": {"box_width": box_width_cm, "box_height": box_height_cm},
    }
