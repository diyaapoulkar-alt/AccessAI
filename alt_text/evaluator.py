import base64
import json
import mimetypes
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

try:
    from .prompts import ALT_TEXT_SYSTEM_PROMPT
except ImportError:
    from prompts import ALT_TEXT_SYSTEM_PROMPT

load_dotenv()

def evaluate_alt_text(image_path, existing_alt_text):
    """Evaluate existing alt-text against an image and return a dictionary."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured in .env")

    image_path = Path(image_path)
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    client = OpenAI(api_key=api_key)

    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")

    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        instructions=ALT_TEXT_SYSTEM_PROMPT,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"Existing alt-text: {existing_alt_text}"
                    },
                    {
                        "type": "input_image",
                        "image_url": (
                            f"data:{mimetypes.guess_type(image_path.name)[0] or 'image/jpeg'};"
                            f"base64,{image_data}"
                        )
                    }
                ]
            }
        ]
    )

    try:
        result = json.loads(response.output_text)
    except json.JSONDecodeError as error:
        raise RuntimeError("The model returned invalid JSON") from error

    if not isinstance(result, dict):
        raise RuntimeError("The model response must be a JSON object")

    return result