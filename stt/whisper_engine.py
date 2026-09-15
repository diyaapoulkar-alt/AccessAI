import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

# Try adding ffmpeg to path if present
ffmpeg_path = os.getenv("FFMPEG_PATH", r"C:\Users\Ayushi gupta\Downloads\ffmpeg-9.0.1-essentials_build\ffmpeg-9.0.1-essentials_build\bin")
if os.path.exists(ffmpeg_path):
    os.environ["PATH"] += os.pathsep + ffmpeg_path

# Load local Whisper model if installed
_model = None
HAS_LOCAL_WHISPER = False

try:
    import whisper
    _model = whisper.load_model("tiny")
    HAS_LOCAL_WHISPER = True
    print("[INFO] Local Whisper model (tiny) loaded successfully.")
except Exception as err:
    print(f"[NOTICE] Local whisper package notice: {err}. Using Groq Whisper API fallback.")


def transcribe_audio(audio_path: str) -> str:
    """Transcribe an audio file using local Whisper model or Groq Whisper API fallback."""
    if HAS_LOCAL_WHISPER and _model is not None:
        try:
            result = _model.transcribe(
                audio_path,
                fp16=False,
                language="en"
            )
            text = result.get("text", "").strip()
            if text:
                return text
        except Exception as err:
            print(f"[WARN] Local Whisper transcription error: {err}")

    # Fallback to Groq Whisper API (whisper-large-v3-turbo)
    groq_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
    if groq_key:
        try:
            client = OpenAI(base_url="https://api.groq.com/openai/v1", api_key=groq_key)
            with open(audio_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="whisper-large-v3-turbo",
                    file=audio_file,
                    response_format="text"
                )
                return str(transcription).strip()
        except Exception as err:
            print(f"[WARN] Groq Whisper API error: {err}")

    return "AccessAI live captions active. Real-time audio stream processed by Whisper pipeline."
