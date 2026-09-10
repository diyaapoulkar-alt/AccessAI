import pytesseract
from PIL import Image
from pytesseract import TesseractNotFoundError


def extract_text(image_path):
    """
    Extracts text from an image using OCR.
    """

    try:
        with Image.open(image_path) as image:
            text = pytesseract.image_to_string(image)
    except TesseractNotFoundError as error:
        raise RuntimeError(
            "Tesseract is not installed or is not on PATH. "
            "Install Tesseract OCR and restart the terminal."
        ) from error

    return text.strip()


if __name__ == "__main__":

    image_path = "test_document.jpg"

    text = extract_text(image_path)

    print("\nOCR RESULT")
    print("--------------------")
    print(text)