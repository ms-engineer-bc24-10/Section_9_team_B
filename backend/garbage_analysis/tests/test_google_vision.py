import os
from unittest import TestCase
from unittest.mock import patch, Mock, mock_open
from garbage_analysis.google_vision import analyze_garbage


class TestGoogleVision(TestCase):
    @patch("builtins.open", new_callable=mock_open, read_data=b"dummy image data")
    @patch("garbage_analysis.google_vision.vision.ImageAnnotatorClient")
    def test_analyze_garbage_detects_labels(self, mock_vision_client, mock_file):
        """
        正常系: ゴミ袋とラベルが適切に検出される。
        """
        # モックの設定
        mock_response = Mock()
        mock_response.label_annotations = [
            Mock(description="plastic bag"),
            Mock(description="bottle"),
        ]
        mock_response.localized_object_annotations = [
            Mock(
                bounding_poly=Mock(
                    normalized_vertices=[
                        Mock(x=0.1, y=0.1),
                        Mock(x=0.5, y=0.1),
                        Mock(x=0.5, y=0.5),
                        Mock(x=0.1, y=0.5),
                    ]
                ),
                name="bag",
            )
        ]
        mock_vision_client.return_value.label_detection.return_value = mock_response
        mock_vision_client.return_value.object_localization.return_value = mock_response

        # テスト実行
        result = analyze_garbage("dummy_path")

        # 検証
        self.assertTrue(result["garbage_bag_detected"])
        self.assertIn("plastic bag", result["labels"])
        self.assertGreater(result["points"], 0)
