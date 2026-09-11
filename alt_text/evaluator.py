import base64
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from ocr.ocr_engine import extract_text

try:
    from .prompts import ALT_TEXT_SYSTEM_PROMPT
except ImportError:
    from prompts import ALT_TEXT_SYSTEM_PROMPT

load_dotenv()

def evaluate_alt_text(image_path, existing_alt_text):
    """Evaluate existing alt-text against an image and return a dictionary."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured in .env")

    image_path = Path(image_path)
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
    )

    try:
        extracted_text = extract_text(image_path)
    except RuntimeError:
        extracted_text = ""

    response = client.chat.completions.create(
        model=os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-120b",
        ),
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": ALT_TEXT_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": (
                    f"Existing alt-text: {existing_alt_text}\n\n"
                    f"Text extracted from the image by OCR:\n{extracted_text or '[No text detected]'}\n\n"
                    "Evaluate the existing alt-text using the OCR text. "
                    "Do not claim visual details that are not present in the OCR text."
                ),
            }
        ]
    )

    try:
        result = json.loads(response.choices[0].message.content)
    except (IndexError, AttributeError, TypeError) as error:
        raise RuntimeError("Groq returned an empty evaluator response") from error
    except json.JSONDecodeError as error:
        raise RuntimeError("Groq returned invalid evaluator JSON") from error

    if not isinstance(result, dict):
        raise RuntimeError("The model response must be a JSON object")

    return result