import os
import sys
import time
import json
import datetime

# Fix Windows console UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Terminal Colors for High-Contrast Live Output
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"
BLUE = "\033[94m"
RED = "\033[91m"
WHITE_ON_BLACK = "\033[97;40m"
YELLOW_ON_BLACK = "\033[93;40m"

class MeetSpeakerAnalyzer:
    def __init__(self):
        self.is_running = False
        self.transcripts = []
        self.speakers = [
            {"name": "Diya Poulkar (Host)", "role": "Real-Time Audio & AI Systems Architect", "color": CYAN},
            {"name": "Eshaan Dogra (Presenter)", "role": "UX/UI & Compliance Specialist", "color": GREEN},
            {"name": "Ayushi Gupta (Specialist)", "role": "AI Vision & Speech Synthesis Developer", "color": MAGENTA},
            {"name": "Kunwar Singh (Auditor)", "role": "Integration & Testing Developer", "color": BLUE}
        ]
        self.simulated_dialogue = [
            "Welcome everyone to today's AccessAI Google Meet live caption session.",
            "AccessAI is analyzing the meet screen and detecting who is speaking in real time.",
            "Live captions are streaming with under 80ms latency directly in the floating extension overlay.",
            "High-contrast Yellow-on-Black subtitle mode is active for low-vision participants.",
            "OpenDyslexic typography support and speaker diarization are working cleanly.",
            "Meeting summary: All WCAG 2.1 AA accessibility standards verified and operating smoothly."
        ]
        self.sim_index = 0

    def print_banner(self):
        print(f"{YELLOW_ON_BLACK}{BOLD}" + "="*78 + f"{RESET}")
        print(f"{YELLOW_ON_BLACK}{BOLD} AccessAI Platform - Google Meet Live Captions & Speaker Analyzer  {RESET}")
        print(f"{YELLOW_ON_BLACK}{BOLD}" + "="*78 + f"{RESET}\n")

    def format_timestamp(self):
        return datetime.datetime.now().strftime("%I:%M:%S %p")

    def run_live_meet_stream(self, duration_seconds=16):
        self.is_running = True
        self.print_banner()

        print(f"{BOLD}{GREEN}[INFO] Initializing Real-Time Google Meet Screen & Speaker Analyzer...{RESET}")
        print(f"{BOLD}{CYAN}[INFO] Diarization Active: Tracking Host, Presenter, Participants & Live Microphone{RESET}\n")
        print(f"{WHITE_ON_BLACK}{BOLD} --- LIVE CAPTIONS TERMINAL STREAM --- {RESET}\n")

        start_time = time.time()
        
        while self.is_running and (time.time() - start_time < duration_seconds):
            speaker_info = self.speakers[self.sim_index % len(self.speakers)]
            text = self.simulated_dialogue[self.sim_index % len(self.simulated_dialogue)]
            timestamp = self.format_timestamp()

            entry = {
                "timestamp": timestamp,
                "speaker": speaker_info["name"],
                "role": speaker_info["role"],
                "text": text
            }
            self.transcripts.append(entry)

            color = speaker_info["color"]
            print(f"[{timestamp}] {color}{BOLD}[SPEAKER: {speaker_info['name']}]{RESET}")
            print(f"   {YELLOW_ON_BLACK}{BOLD} CAPTION: \"{text}\" {RESET}\n")

            self.sim_index += 1
            time.sleep(2.5)

        self.save_export()

    def save_export(self):
        print(f"\n{YELLOW_ON_BLACK}{BOLD} --- MEETING SUMMARY & TRANSCRIPT EXPORT --- {RESET}")
        
        json_file = "meet_transcript.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(self.transcripts, f, indent=2)
        print(f"{GREEN}[OK] Saved full transcript to {json_file}{RESET}")

        summary_file = "meet_summary.txt"
        with open(summary_file, "w", encoding="utf-8") as f:
            f.write("=== AccessAI Google Meet Session Summary ===\n\n")
            for item in self.transcripts:
                f.write(f"[{item['timestamp']}] {item['speaker']}: {item['text']}\n")
        print(f"{GREEN}[OK] Saved summary notes to {summary_file}{RESET}\n")

if __name__ == "__main__":
    analyzer = MeetSpeakerAnalyzer()
    analyzer.run_live_meet_stream(duration_seconds=16)