from pathlib import Path
import shutil
import tempfile

from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from alt_text.evaluator import evaluate_alt_text
from alt_text.prompts import PROMPT_TEMPLATES
from ocr.ocr_engine import extract_text


app = FastAPI(title="AI Accessibility Engine")


@app.get("/prompt-templates")
def prompt_templates():
    """Return the prompt templates used by the accessibility features."""
    return PROMPT_TEMPLATES


@app.post("/evaluate-alt-text")
async def evaluate_uploaded_alt_text(
    image: UploadFile = File(...),
    existing_alt_text: str = Form(""),
):
    """Evaluate uploaded image alt-text."""
    suffix = Path(image.filename or "image.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
        shutil.copyfileobj(image.file, temporary_file)
        temporary_path = Path(temporary_file.name)

    try:
        return evaluate_alt_text(temporary_path, existing_alt_text)
    except (FileNotFoundError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        temporary_path.unlink(missing_ok=True)


@app.post("/ocr")
async def extract_uploaded_text(image: UploadFile = File(...)):
    """Extract text from an uploaded document or sign image."""
    suffix = Path(image.filename or "image.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
        shutil.copyfileobj(image.file, temporary_file)
        temporary_path = Path(temporary_file.name)

    try:
        return {"text": extract_text(temporary_path)}
    except (FileNotFoundError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        temporary_path.unlink(missing_ok=True)