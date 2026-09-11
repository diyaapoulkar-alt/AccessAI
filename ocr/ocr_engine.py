"""
Vision OCR Engine for Documents and Signs.
Authored by Diya Payal (Accessibility & AI Engine Specialist).
Extracts text from uploaded images, documents, invoices, and street signs with
automatic Tesseract detection on Windows, macOS, and Linux.
"""

import os
from pathlib import Path
import shutil

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


def preprocess_image_for_ocr(image: Image.Image, mode: str = "document") -> Image.Image:
    """
    Preprocesses an image to maximize OCR text recognition accuracy.
    - 'document': optimizes for scanned text, invoices, and prescriptions.
    - 'sign': optimizes for outdoor signage, street signs, and high-contrast labels.
    """
    # Convert RGBA / CMYK to RGB first
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")

    # Convert to grayscale
    gray = image.convert("L")

    # Autocontrast to normalize brightness and stretch dynamic range
    enhanced = ImageOps.autocontrast(gray, cutoff=2)

    if mode == "sign":
        # For signs: boost contrast and sharpen edges to distinguish bold letters
        contrast_booster = ImageEnhance.Contrast(enhanced)
        enhanced = contrast_booster.enhance(1.8)
        enhanced = enhanced.filter(ImageFilter.SHARPEN)
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
        result = extract_text(test_file)
        print("OCR Output:\n", result or "[No text detected in image]")
    except Exception as exc:
        print("OCR Error:", exc)