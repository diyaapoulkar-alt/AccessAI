"""
Vision OCR Engine for Documents and Signs.
Authored by Diya Payal (Accessibility & AI Engine Specialist).
Extracts text from uploaded images, documents, invoices, and street signs with
automatic Tesseract detection on Windows, macOS, and Linux.
"""

import base64
import os
from pathlib import Path
import re
import shutil
from typing import Any, Dict, Optional, Tuple

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import pytesseract
from pytesseract import TesseractNotFoundError


def _configure_tesseract_binary():
    """
    Locates the Tesseract executable across standard system paths if not already in PATH.
    Configures pytesseract.pytesseract.tesseract_cmd automatically.
    """
    # 1. Check explicit environment variable override
    env_tesseract = os.getenv("TESSERACT_CMD")
    if env_tesseract and Path(env_tesseract).is_file():
        pytesseract.pytesseract.tesseract_cmd = env_tesseract
        return env_tesseract

    # 2. Check if already discoverable via system PATH
    which_path = shutil.which("tesseract")
    if which_path:
        pytesseract.pytesseract.tesseract_cmd = which_path
        return which_path

    # 3. Known standard installation directories on Windows, Linux, and macOS
    candidate_paths = [
        # Standard Windows installations
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
        # Standard Linux and macOS paths
        "/usr/bin/tesseract",
        "/usr/local/bin/tesseract",
        "/opt/homebrew/bin/tesseract",
    ]

    for candidate in candidate_paths:
        if candidate and Path(candidate).is_file():
            pytesseract.pytesseract.tesseract_cmd = candidate
            return candidate

    return None


# Run configuration on module load
TESSERACT_PATH = _configure_tesseract_binary()


def auto_rotate_image(image: Image.Image) -> Tuple[Image.Image, int]:
    """
    Detects text orientation using Tesseract OSD (Orientation and Script Detection)
    and rotates tilted or sideways images right-side up.
    Returns (rotated_image, detected_angle_degrees).
    """
    if not TESSERACT_PATH:
        _configure_tesseract_binary()

    try:
        work_img = image if image.mode in ("RGB", "L") else image.convert("RGB")
        osd = pytesseract.image_to_osd(work_img)
        angle = 0
        for line in osd.splitlines():
            if "Rotate:" in line:
                angle = int(line.split(":")[1].strip())
                break
        if angle in (90, 180, 270):
            # Tesseract reports rotation needed to orient upright clockwise
            # Pillow rotate(360 - angle) rotates clockwise by angle
            return image.rotate(360 - angle, expand=True), angle
        return image, 0
    except Exception:
        # Fall back gracefully if OSD fails (e.g. sparse text or no script data)
        return image, 0


def super_resolve_and_denoise(image: Image.Image, scale: float = 2.0) -> Image.Image:
    """
    Super-resolves small or blurry text using Lanczos upscaling, median filter denoising,
    and adaptive dynamic contrast normalization.
    """
    w, h = image.size
    # Upscale only if image is moderately sized to maintain high performance
    if w < 2500 and h < 2500 and scale > 1.0:
        new_w = int(w * scale)
        new_h = int(h * scale)
        resample = getattr(Image.Resampling, "LANCZOS", Image.LANCZOS)
        enhanced = image.resize((new_w, new_h), resample=resample)
    else:
        enhanced = image

    # Ensure grayscale
    if enhanced.mode != "L":
        enhanced = enhanced.convert("L")

    # Median filter to eliminate specks, scanner grain, and low-light noise
    enhanced = enhanced.filter(ImageFilter.MedianFilter(size=3))

    # Dynamic autocontrast to normalize brightness and stretch dynamic range
    enhanced = ImageOps.autocontrast(enhanced, cutoff=2)

    return enhanced


def preprocess_image_for_ocr(
    image: Image.Image,
    mode: str = "document",
    auto_rotate: bool = False,
    super_resolve: bool = False,
) -> Image.Image:
    """
    Preprocesses an image to maximize OCR text recognition accuracy.
    - 'document': optimizes for scanned text, invoices, and prescriptions.
    - 'sign': optimizes for outdoor signage, street signs, and high-contrast labels.
    - 'prescription': boosts sharpness and edge definitions for faint handwriting and dosages.
    """
    if auto_rotate:
        image, _ = auto_rotate_image(image)

    if super_resolve:
        enhanced = super_resolve_and_denoise(image)
    else:
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        gray = image.convert("L")
        enhanced = ImageOps.autocontrast(gray, cutoff=2)

    if mode == "sign":
        # For signs: boost contrast and sharpen edges to distinguish bold letters
        contrast_booster = ImageEnhance.Contrast(enhanced)
        enhanced = contrast_booster.enhance(1.8)
        enhanced = enhanced.filter(ImageFilter.SHARPEN)
    elif mode == "prescription":
        # For prescriptions: boost contrast and sharpen to preserve faint penmanship and Rx symbols
        contrast_booster = ImageEnhance.Contrast(enhanced)
        enhanced = contrast_booster.enhance(1.6)
        sharpener = ImageEnhance.Sharpness(enhanced)
        enhanced = sharpener.enhance(1.4)
    else:
        # For documents: slight contrast boost and mild sharpness
        contrast_booster = ImageEnhance.Contrast(enhanced)
        enhanced = contrast_booster.enhance(1.4)

    return enhanced


def extract_text(image_path, preprocess: bool = True, psm: int = 3) -> str:
    """
    Extracts text from an image path using Tesseract OCR.
    
    Parameters:
    - image_path: Path or str pointing to the target image file.
    - preprocess: When True, applies grayscale and contrast normalization.
    - psm: Tesseract Page Segmentation Mode (PSM).
           PSM 3 = Fully automatic page segmentation (default)
           PSM 6 = Assume a single uniform block of text (good for documents)
           PSM 11 = Sparse text with as much text as possible (good for signs)
    """
    image_path = Path(image_path)
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Ensure Tesseract path is initialized
    if not TESSERACT_PATH:
        _configure_tesseract_binary()

    try:
        with Image.open(image_path) as img:
            target_image = preprocess_image_for_ocr(img) if preprocess else img
            custom_config = f"--psm {psm}"
            text = pytesseract.image_to_string(target_image, config=custom_config)
            return text.strip()
    except TesseractNotFoundError as error:
        raise RuntimeError(
            "Tesseract OCR is not installed or could not be found. "
            "Please install Tesseract or set TESSERACT_CMD in your .env file."
        ) from error


def extract_text_with_confidence(
    image_path,
    preprocess: bool = True,
    psm: int = 3,
    mode: str = "document",
    auto_rotate: bool = True,
    super_resolve: bool = False,
) -> Dict[str, Any]:
    """
    Extracts text along with per-word confidence metrics, word statistics, and orientation angle.
    Uses pytesseract.image_to_data for word-level telemetry.
    """
    image_path = Path(image_path)
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    if not TESSERACT_PATH:
        _configure_tesseract_binary()

    try:
        with Image.open(image_path) as img:
            angle = 0
            if auto_rotate:
                img, angle = auto_rotate_image(img)

            target_image = (
                preprocess_image_for_ocr(
                    img, mode=mode, auto_rotate=False, super_resolve=super_resolve
                )
                if preprocess
                else img
            )
            custom_config = f"--psm {psm}"

            raw_text = pytesseract.image_to_string(target_image, config=custom_config).strip()
            data = pytesseract.image_to_data(
                target_image, config=custom_config, output_type=pytesseract.Output.DICT
            )

            confidences = []
            words = []
            for i, text in enumerate(data.get("text", [])):
                conf = data.get("conf", [])[i]
                clean_w = str(text).strip()
                if clean_w and conf != -1:
                    conf_float = float(conf)
                    confidences.append(conf_float)
                    words.append({"text": clean_w, "confidence": round(conf_float, 1)})

            avg_confidence = (
                round(sum(confidences) / len(confidences), 1)
                if confidences
                else (90.0 if raw_text else 0.0)
            )

            return {
                "text": raw_text,
                "confidence": avg_confidence,
                "word_count": len(words),
                "character_count": len(raw_text),
                "orientation_corrected_degrees": angle,
                "words": words[:50],
            }
    except TesseractNotFoundError as error:
        raise RuntimeError(
            "Tesseract OCR is not installed or could not be found. "
            "Please install Tesseract or set TESSERACT_CMD in your .env file."
        ) from error


def _heuristic_classify_domain(text: str) -> str:
    """Lightweight heuristic domain classifier for offline fallback."""
    lower = text.lower()
    if any(k in lower for k in ("rx", "mg", "tablet", "capsule", "doctor", "clinic", "dosage", "prescription", "refill", "take")):
        return "medical_prescription"
    if any(k in lower for k in ("invoice", "bill", "due date", "total", "subtotal", "amount", "tax", "balance", "receipt", "payment")):
        return "invoice"
    if any(k in lower for k in ("danger", "warning", "caution", "notice", "stop", "speed limit", "pedestrian", "yield", "exit", "no parking")):
        return "street_sign"
    return "general"


def _heuristic_extract_entities(text: str, domain: Optional[str] = None) -> Dict[str, Any]:
    """Lightweight entity extraction using pattern matching for offline fallback."""
    entities: Dict[str, Any] = {}
    lower = text.lower()

    # Monetary amounts (e.g., $125.00, 45.99 USD)
    money_matches = re.findall(r"(?:[\$\€\£\₹]\s*\d+(?:\.\d{2})?|\b\d+\.\d{2}\s*(?:usd|eur|gbp|inr)\b)", text, re.IGNORECASE)
    if money_matches:
        entities["monetary_amounts"] = money_matches

    # Dosages / medication strengths (e.g., 500mg, 10ml, 2 tablets)
    dosage_matches = re.findall(r"\b\d+\s*(?:mg|ml|mcg|tablets?|capsules?|drops?)\b", text, re.IGNORECASE)
    if dosage_matches:
        entities["dosages"] = dosage_matches

    # Dates
    date_matches = re.findall(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", text)
    if date_matches:
        entities["dates"] = date_matches

    # Hazard notices
    hazard_matches = re.findall(r"\b(DANGER|WARNING|CAUTION|NOTICE|YIELD|STOP)\b", text, re.IGNORECASE)
    if hazard_matches:
        entities["hazard_keywords"] = list({h.upper() for h in hazard_matches})

    return entities


def _generate_heuristic_audio_script(text: str) -> str:
    """Generates a plain spoken audio script for text-to-speech fallback."""
    if not text:
        return "No readable text was detected in the uploaded image."
    cleaned = " ".join(text.split())
    # Expand common prescription abbreviations for smooth listening
    cleaned = re.sub(r"\bPO\b", "by mouth", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bTID\b", "three times daily", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bBID\b", "two times daily", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bQD\b", "once daily", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bPRN\b", "as needed", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bmg\b", "milligrams", cleaned, flags=re.IGNORECASE)
    return f"Text content: {cleaned}"


def hybrid_ai_ocr(
    image_path,
    domain: Optional[str] = None,
    api_key: Optional[str] = None,
    smart_correct: bool = True,
    extract_entities: bool = True,
    mode: str = "document",
) -> Dict[str, Any]:
    """
    Supercharged Hybrid Dual-Engine OCR.
    1. Local Tesseract pass with auto-orientation, Lanczos super-resolution, and confidence scoring.
    2. Cloud Groq pass (Qwen 3.8 Vision) for spelling correction, domain classification,
       structured entity extraction (Rx dosages, bill totals, sign hazards), and screen-reader audio scripts.
    3. Fully resilient: falls back gracefully to local heuristic parsing if cloud AI is unavailable.
    """
    # 1. Run local OCR pass
    ocr_meta = extract_text_with_confidence(image_path, preprocess=True, mode=mode, auto_rotate=True)
    raw_text = ocr_meta["text"]

    detected_domain = domain or _heuristic_classify_domain(raw_text)

    result: Dict[str, Any] = {
        "mode": mode,
        "text": raw_text,
        "corrected_text": raw_text,
        "domain": detected_domain,
        "entities": _heuristic_extract_entities(raw_text, detected_domain),
        "audio_script": _generate_heuristic_audio_script(raw_text),
        "confidence": ocr_meta["confidence"],
        "word_count": ocr_meta["word_count"],
        "character_count": ocr_meta["character_count"],
        "orientation_corrected_degrees": ocr_meta["orientation_corrected_degrees"],
        "engine": "tesseract",
    }

    # 2. Cloud AI multimodal pass if requested
    if smart_correct or extract_entities:
        try:
            from alt_text.evaluator import clean_json_response, get_configured_groq_key
            from alt_text.prompts import OCR_ENTITY_EXTRACTION_PROMPT

            effective_key = get_configured_groq_key(api_key)
            if effective_key:
                from openai import OpenAI
                client = OpenAI(base_url="https://api.groq.com/openai/v1", api_key=effective_key)

                with open(image_path, "rb") as img_file:
                    image_base64 = base64.b64encode(img_file.read()).decode("utf-8")

                mime = "image/jpeg"
                lower_p = str(image_path).lower()
                if lower_p.endswith(".png"):
                    mime = "image/png"
                elif lower_p.endswith(".webp"):
                    mime = "image/webp"

                user_instruction = (
                    f"Analyze this document/sign image and the raw Tesseract OCR output below:\n"
                    f"--- RAW OCR TEXT ---\n{raw_text or '[No text extracted by local OCR]'}\n"
                    f"--- END RAW OCR ---\n"
                    f"Target Domain: {domain or 'auto-detect'}.\n"
                    f"Correct any OCR typos, classify domain, extract key entities, and produce a screen-reader audio script."
                )

                response = client.chat.completions.create(
                    model="qwen/qwen3.8-27b",
                    messages=[
                        {"role": "system", "content": OCR_ENTITY_EXTRACTION_PROMPT},
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {"url": f"data:{mime};base64,{image_base64}"},
                                },
                                {"type": "text", "text": user_instruction},
                            ],
                        },
                    ],
                    temperature=0.1,
                    max_tokens=600,
                    response_format={"type": "json_object"},
                )

                ai_content = response.choices[0].message.content
                ai_data = clean_json_response(ai_content)

                if isinstance(ai_data, dict):
                    result["engine"] = "hybrid_tesseract_groq_qwen"
                    if "domain" in ai_data and ai_data["domain"]:
                        result["domain"] = ai_data["domain"]
                    if "corrected_text" in ai_data and ai_data["corrected_text"]:
                        result["corrected_text"] = ai_data["corrected_text"]
                    if "entities" in ai_data and isinstance(ai_data["entities"], dict):
                        result["entities"] = ai_data["entities"]
                    if "audio_script" in ai_data and ai_data["audio_script"]:
                        result["audio_script"] = ai_data["audio_script"]
                    if "notes" in ai_data:
                        result["notes"] = ai_data["notes"]
        except Exception:
            # Maintain resilience: fallback cleanly to Tesseract results
            pass

    return result


def extract_document_text(image_path) -> str:
    """Specialized extraction for documents, bills, prescriptions (PSM 6 - single uniform block)."""
    return extract_text(image_path, preprocess=True, psm=6)


def extract_sign_text(image_path) -> str:
    """Specialized extraction for street signs, warnings, and sparse labels (PSM 11 - sparse text)."""
    return extract_text(image_path, preprocess=True, psm=11)


if __name__ == "__main__":
    import sys
    test_file = sys.argv[1] if len(sys.argv) > 1 else "alt_text/test_image.jpg"
    print(f"Using Tesseract at: {pytesseract.pytesseract.tesseract_cmd}")
    try:
        result = extract_text_with_confidence(test_file)
        print("OCR Output with confidence:\n", result)
    except Exception as exc:
        print("OCR Error:", exc)