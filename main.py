"""
AccessAI Backend REST API Engine.
Authored by Diya Payal (Accessibility & AI Engine Specialist) & Diya Poulkar.
Provides endpoints for WCAG Alt-Text Evaluation, Document & Sign OCR, and Prompt Templates.
"""

import os
from pathlib import Path
import shutil
import tempfile
from typing import Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import APIConnectionError, AuthenticationError, RateLimitError
import pytesseract

from alt_text.evaluator import evaluate_alt_text, get_configured_groq_key
from alt_text.prompts import PROMPT_TEMPLATES
from ocr.ocr_engine import TESSERACT_PATH, extract_sign_text, extract_text


app = FastAPI(
    title="AccessAI Accessibility & Vision Engine",
    description="AI-powered WCAG Alt-Text Evaluator and Document/Sign OCR API",
    version="1.0.0",
)

# Enable CORS for frontend Vite development servers and external integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
@app.get("/config-status")
def get_config_status():
    """Returns the configuration and readiness status of Groq AI and Tesseract OCR."""
    groq_key = get_configured_groq_key()
    return {
        "status": "online",
        "groq": {
            "is_configured": bool(groq_key),
            "key_preview": f"{groq_key[:6]}...{groq_key[-4:]}" if groq_key else None,
            "model": os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"),
        },
        "ocr": {
            "is_configured": bool(TESSERACT_PATH or pytesseract.pytesseract.tesseract_cmd),
            "tesseract_binary": TESSERACT_PATH or pytesseract.pytesseract.tesseract_cmd or "Not detected",
        },
    }


@app.get("/prompt-templates")
def get_prompt_templates():
    """Return the prompt templates used by the accessibility features."""
    return PROMPT_TEMPLATES


@app.post("/evaluate-alt-text")
async def evaluate_uploaded_alt_text(
    image: UploadFile = File(...),
    existing_alt_text: str = Form(""),
    groq_api_key: Optional[str] = Form(None),
    x_groq_api_key: Optional[str] = Header(None, alias="X-Groq-Api-Key"),
    authorization: Optional[str] = Header(None),
):
    """
    Evaluate uploaded image alt-text against WCAG 2.1/2.2 AA.
    Accepts API key via form data, X-Groq-Api-Key header, Bearer token, or .env.
    """
    effective_key = groq_api_key or x_groq_api_key
    if not effective_key and authorization and authorization.lower().startswith("bearer "):
        effective_key = authorization[7:].strip()

    suffix = Path(image.filename or "image.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
        shutil.copyfileobj(image.file, temporary_file)
        temporary_path = Path(temporary_file.name)

    try:
        return evaluate_alt_text(
            image_path=temporary_path,
            existing_alt_text=existing_alt_text,
            api_key=effective_key,
        )
    except FileNotFoundError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except AuthenticationError as error:
        raise HTTPException(
            status_code=401,
            detail="Invalid GROQ_API_KEY. Please verify your key at https://console.groq.com/keys",
        ) from error
    except RateLimitError as error:
        raise HTTPException(status_code=429, detail="Groq API quota or rate limit exceeded.") from error
    except APIConnectionError as error:
        raise HTTPException(status_code=502, detail="Could not connect to Groq API gateway.") from error
    except RuntimeError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        temporary_path.unlink(missing_ok=True)


@app.post("/ocr")
async def extract_uploaded_text(
    image: UploadFile = File(...),
    mode: str = Form("document"),  # 'document' or 'sign'
    preprocess: bool = Form(True),
):
    """Extract text from an uploaded document, prescription, receipt, or street sign."""
    suffix = Path(image.filename or "image.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
        shutil.copyfileobj(image.file, temporary_file)
        temporary_path = Path(temporary_file.name)

    try:
        if mode == "sign":
            text = extract_sign_text(temporary_path)
        else:
            text = extract_text(temporary_path, preprocess=preprocess)
        return {
            "mode": mode,
            "text": text,
            "character_count": len(text),
        }
    except (FileNotFoundError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        temporary_path.unlink(missing_ok=True)