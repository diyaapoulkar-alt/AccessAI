const API_BASE_URL = import.meta.env.VITE_ACCESSIBILITY_API_URL || 'http://127.0.0.1:8000';

export async function extractTextWithBackend(file) {
  const formData = new FormData();
  formData.append('image', file, file.name || 'image.jpg');

  const response = await fetch(`${API_BASE_URL}/ocr`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `OCR request failed with HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.text || '';
}

export async function evaluateAltTextWithBackend(file, existingAltText) {
  const formData = new FormData();
  formData.append('image', file, file.name || 'image.jpg');
  formData.append('existing_alt_text', existingAltText);

  const response = await fetch(`${API_BASE_URL}/evaluate-alt-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Alt-text request failed with HTTP ${response.status}`);
  }

  return response.json();
}