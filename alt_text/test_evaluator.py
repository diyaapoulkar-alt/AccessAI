"""
Unit and Integration Tests for AI Alt-Text Evaluator and OCR Engine.
Authored by Diya Payal (Accessibility & AI Engine Specialist).
"""

from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from alt_text.evaluator import (
    clean_json_response,
    evaluate_alt_text,
    get_configured_groq_key,
)
from alt_text.prompts import PROMPT_TEMPLATES
from alt_text.test_cases import ALT_TEXT_BENCHMARK_CASES
from ocr.ocr_engine import extract_text, preprocess_image_for_ocr
from PIL import Image


def test_evaluator_rejects_missing_image(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "gsk_mock_test_key_12345")
    with pytest.raises(FileNotFoundError):
        evaluate_alt_text("non_existent_image_12345.jpg", "photo")


def test_evaluator_rejects_missing_api_key(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    monkeypatch.delenv("VITE_GROQ_API_KEY", raising=False)
    with pytest.raises(RuntimeError) as exc_info:
        evaluate_alt_text("alt_text/test_image.jpg", "photo", api_key="")
    assert "GROQ_API_KEY is not configured" in str(exc_info.value)


def test_key_resolution_order(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    monkeypatch.delenv("VITE_GROQ_API_KEY", raising=False)

    # 1. Neither set
    assert get_configured_groq_key(None) is None

    # 2. VITE_GROQ_API_KEY set
    monkeypatch.setenv("VITE_GROQ_API_KEY", "gsk_vite_key")
    assert get_configured_groq_key(None) == "gsk_vite_key"

    # 3. GROQ_API_KEY set
    monkeypatch.setenv("GROQ_API_KEY", "gsk_server_key")
    assert get_configured_groq_key(None) == "gsk_server_key"

    # 4. Explicit key overrides all
    assert get_configured_groq_key("gsk_explicit_key") == "gsk_explicit_key"


def test_clean_json_response_direct():
    raw = '{"quality": "Good", "score": 95, "wcag_compliant": true, "suggested_alt_text": "A chart"}'
    parsed = clean_json_response(raw)
    assert parsed["quality"] == "Good"
    assert parsed["score"] == 95
    assert parsed["wcag_compliant"] is True


def test_clean_json_response_with_markdown_fences():
    raw = '''```json
    {
        "quality": "Poor",
        "score": 20,
        "reason": "Generic filename used",
        "suggested_alt_text": "Sunset over snow-capped mountains",
        "is_decorative": false
    }
    ```'''
    parsed = clean_json_response(raw)
    assert parsed["quality"] == "Poor"
    assert parsed["score"] == 20
    assert "Sunset" in parsed["suggested_alt_text"]


def test_clean_json_response_rejects_invalid():
    with pytest.raises(ValueError):
        clean_json_response("")

    with pytest.raises(ValueError):
        clean_json_response("This is not JSON text")


def test_prompt_templates_registry():
    assert "alt_text_evaluator" in PROMPT_TEMPLATES
    assert "document_ocr_explainer" in PROMPT_TEMPLATES
    assert "sign_warning_explainer" in PROMPT_TEMPLATES
    assert len(PROMPT_TEMPLATES["alt_text_evaluator"]["template"]) > 50


def test_ocr_engine_extract_text_on_test_image():
    # Verify OCR runs and does not crash on existing test_image.jpg
    test_img = Path("alt_text/test_image.jpg")
    if test_img.is_file():
        result = extract_text(test_img)
        assert isinstance(result, str)


def test_image_preprocessing():
    img = Image.new("RGB", (100, 100), color=(200, 150, 100))
    processed = preprocess_image_for_ocr(img, mode="sign")
    assert processed.mode == "L"
    assert processed.size == (100, 100)


@patch("alt_text.evaluator.OpenAI")
def test_evaluate_alt_text_mocked_groq_vision(mock_openai_class):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(
            message=MagicMock(
                content='{"quality": "Good", "score": 92, "wcag_compliant": true, "is_decorative": false, "reason": "Accurate and concise", "suggested_alt_text": "Sample alt text", "issues_detected": []}'
            )
        )
    ]
    mock_client.chat.completions.create.return_value = mock_response

    test_img = Path("alt_text/test_image.jpg")
    result = evaluate_alt_text(
        image_path=str(test_img),
        existing_alt_text="Sample alt text",
        api_key="gsk_test_dummy_key",
        model="llama-3.2-11b-vision-preview",
    )

    assert result["quality"] == "Good"
    assert result["score"] == 92
    assert result["wcag_compliant"] is True
    assert mock_client.chat.completions.create.called


def test_fastapi_config_and_ocr_endpoints():
    from io import BytesIO
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)

    # 1. Test /config-status
    res = client.get("/config-status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "groq" in data
    assert "ocr" in data
    assert data["ocr"]["is_configured"] is True

    # 2. Test /prompt-templates
    res_pt = client.get("/prompt-templates")
    assert res_pt.status_code == 200
    assert "alt_text_evaluator" in res_pt.json()

    # 3. Test /ocr with synthetic image
    img = Image.new("RGB", (250, 70), color=(255, 255, 255))
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    res_ocr = client.post(
        "/ocr",
        files={"image": ("test_doc.png", buf, "image/png")},
        data={"mode": "document", "preprocess": "true"},
    )
    assert res_ocr.status_code == 200
    assert res_ocr.json()["mode"] == "document"


@patch("alt_text.evaluator.OpenAI")
def test_fastapi_evaluate_alt_text_endpoint(mock_openai_class):
    from io import BytesIO
    from fastapi.testclient import TestClient
    from main import app

    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(
            message=MagicMock(
                content='{"quality": "Good", "score": 96, "wcag_compliant": true, "is_decorative": false, "reason": "Clear and accessible description", "suggested_alt_text": "Sample logo", "issues_detected": []}'
            )
        )
    ]
    mock_client.chat.completions.create.return_value = mock_response

    client = TestClient(app)
    img = Image.new("RGB", (100, 100), color=(50, 100, 150))
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    # Test passing X-Groq-Api-Key header dynamically
    res = client.post(
        "/evaluate-alt-text",
        files={"image": ("logo.png", buf, "image/png")},
        data={"existing_alt_text": "Company logo"},
        headers={"X-Groq-Api-Key": "gsk_dynamic_header_test"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["quality"] == "Good"
    assert data["score"] == 96
    assert data["wcag_compliant"] is True