
import os
os.environ["PATH"] += os.pathsep + r"C:\Users\Ayushi gupta\Downloads\ffmpeg-9.0.1-essentials_build\ffmpeg-9.0.1-essentials_build\bin"
import whisper

# Load the Whisper model once when the backend starts.
# "tiny" is fast enough for our live-caption demo.
model = whisper.load_model("tiny")


def transcribe_audio(audio_path: str) -> str:
    """Transcribe an audio file using Whisper."""
    result = model.transcribe(
        audio_path,
        fp16=False,
        language="en"
    )

    return result.get("text", "").strip()
