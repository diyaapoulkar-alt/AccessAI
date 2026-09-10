import os
import json
import base64

from openai import OpenAI
from dotenv import load_dotenv

from .prompts import ALT_TEXT_SYSTEM_PROMPT

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def evaluate_alt_text(image_path, existing_alt_text):
    """
    Evaluates whether existing alt-text meaningfully describes an image.
    """

    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(
            image_file.read()
        ).decode("utf-8")

    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        instructions=ALT_TEXT_SYSTEM_PROMPT,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"""
Existing alt-text:

{existing_alt_text}

Evaluate this alt-text against the image.
"""
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{image_data}"
                    }
                ]
            }
        ]
    )

    result = response.output_text

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {
            "score": 0,
            "status": "Error",
            "reason": result,
            "suggested_alt_text": ""
        }