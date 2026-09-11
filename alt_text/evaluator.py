"""
AI Alt-Text Context Evaluator.
Authored by Diya Payal (Accessibility & AI Engine Specialist).
Evaluates existing alt-text against images using Groq Vision (Llama 3.2 11B Vision)
or text models with OCR extracted context, benchmarked against WCAG 2.1/2.2 AA.
"""

import base64
import json
import mimetypes
import os
from pathlib import Path
import re
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image

from ocr.ocr_engine import extract_text

try:
    from .prompts import ALT_TEXT_SYSTEM_PROMPT
except ImportError:
    from prompts import ALT_TEXT_SYSTEM_PROMPT

# Locate project root .env and load environment variables
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(PROJECT_ROOT / ".env.local")
load_dotenv()  # fallback to current working directory


def get_configured_groq_key(explicit_key: Optional[str] = None) -> Optional[str]:
    """
    Resolves the Groq API key from:
    1. Explicitly passed parameter
    2. GROQ_API_KEY environment variable
    3. VITE_GROQ_API_KEY environment variable
    """
    if explicit_key and explicit_key.strip():
        return explicit_key.strip()

    env_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
    if env_key and env_key.strip():
        return env_key.strip()

    return None


def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Extracts and parses JSON object from model response, handling Markdown code fences."""
    text = raw_text.strip()
    if not text:
        raise ValueError("Empty response received from Groq model")

    # Match JSON wrapped inside markdown code fences: ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()

    parsed = json.loads(text)
    if not isinstance(parsed, dict):
        raise ValueError("Model response must be a JSON object")

    return parsed


def evaluate_alt_text(
    image_path: str,
    existing_alt_text: str,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Evaluate existing alt-text against an image and return structured WCAG evaluation.
    
    Parameters:
    - image_path: Path to the target image file.
    - existing_alt_text: The existing alt attribute text to evaluate (can be empty).
    - api_key: Optional Groq API key override. If not provided, reads GROQ_API_KEY from environment.
    - model: Groq model to use. Defaults to 'llama-3.2-11b-vision-preview' (vision-capable).
    """
    resolved_key = get_configured_groq_key(api_key)
    if not resolved_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured. Please add GROQ_API_KEY=gsk_... to your .env "
            "file, set the GROQ_API_KEY environment variable, or pass the key in the request."
        )

    image_file = Path(image_path)
    if not image_file.is_file():
        raise FileNotFoundError(f"Image not found: {image_file}")

    target_model = model or os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

    # Extract OCR text from the image for contextual reading
    try:
        extracted_text = extract_text(image_file)
    except Exception:
        extracted_text = ""

    # Inspect image properties
    try:
        with Image.open(image_file) as img:
            width, height = img.size
            img_format = img.format or "JPEG"
    except Exception:
        width, height = (0, 0)
        img_format = "Unknown"

    client = OpenAI(
        api_key=resolved_key,
        base_url="https://api.groq.com/openai/v1",
    )

    # Determine if the chosen model supports multimodal vision input
    is_vision_model = "vision" in target_model.lower() or "qwen" in target_model.lower()

    if is_vision_model:
        mime_type = mimetypes.guess_type(image_file.name)[0] or "image/jpeg"
        with open(image_file, "rb") as f:
            base64_data = base64.b64encode(f.read()).decode("utf-8")

        messages = [
            {
                "role": "system",
                "content": ALT_TEXT_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"Existing alt-text: \"{existing_alt_text}\"\n\n"
                            f"Text detected by OCR in image: \"{extracted_text or '[No text detected]'}\"\n\n"
                            "Evaluate this alt-text against the visible image according to WCAG 2.1/2.2 AA. "
                            "Return strictly valid JSON with quality, score, wcag_compliant, is_decorative, "
                            "reason, suggested_alt_text, and issues_detected."
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_data}",
                        },
                    },
                ],
            },
        ]
    else:
        # Text-only model fallback using OCR content and image metadata
        messages = [
            {
                "role": "system",
                "content": ALT_TEXT_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": (
                    f"Existing alt-text: \"{existing_alt_text}\"\n\n"
                    f"Image metadata: Format={img_format}, Dimensions={width}x{height}\n"
                    f"Text extracted by OCR: \"{extracted_text or '[No text detected in image]'}\"\n\n"
                    "Evaluate the existing alt-text using the OCR text and context. "
                    "Return strictly valid JSON with quality, score, wcag_compliant, is_decorative, "
                    "reason, suggested_alt_text, and issues_detected."
                ),
            },
        ]

    response = client.chat.completions.create(
        model=target_model,
        temperature=0.1,
        max_tokens=600,
        response_format={"type": "json_object"},
        messages=messages,
    )

    try:
        raw_content = response.choices[0].message.content
        result = clean_json_response(raw_content)
    except (IndexError, AttributeError, TypeError) as error:
        raise RuntimeError("Groq returned an empty evaluator response") from error
    except (json.JSONDecodeError, ValueError) as error:
        raise RuntimeError(f"Groq returned invalid evaluator JSON: {error}") from error

    # Normalize response fields
    if "quality" not in result:
        score = result.get("score", 0)
        result["quality"] = "Good" if score >= 80 else ("Needs Improvement" if score >= 50 else "Poor")

    if "score" not in result:
        result["score"] = 90 if result.get("quality") == "Good" else 30

    if "suggested_alt_text" not in result:
        result["suggested_alt_text"] = existing_alt_text or "Accessible image description"

    if "issues_detected" not in result:
        result["issues_detected"] = []

    return result