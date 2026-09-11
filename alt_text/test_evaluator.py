import pytest

from evaluator import evaluate_alt_text


def test_evaluator_rejects_missing_image(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    with pytest.raises(FileNotFoundError):
        evaluate_alt_text("missing-image.jpg", "photo")