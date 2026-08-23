export const apiEndpoints = [
  {
    id: "scan-url",
    name: "Analyze Web Page URL",
    method: "POST",
    path: "/api/v1/scan/url",
    description: "Evaluates target webpage for WCAG 2.1 AA technical compliance and AI meaningful accessibility score.",
    requestPayload: {
      url: "https://example.com/checkout",
      evaluateMeaningfulness: true,
      viewport: "desktop",
      rules: ["alt-text-context", "contrast-ratio", "aria-roles", "heading-hierarchy"]
    },
    responsePayload: {
      status: "success",
      scanId: "scan_8f9a0d2b",
      timestamp: "2026-08-19T00:28:00Z",
      metrics: {
        score: 72,
        totalIssues: 5,
        critical: 1,
        high: 2,
        medium: 2
      },
      aiEvaluationSummary: {
        meaningfulAltTextScore: "68%",
        keyboardNavigable: true,
        colorContrastPassRate: "84%"
      }
    },
    curlSnippet: `curl -X POST https://api.accessai.io/v1/scan/url \\
  -H "Authorization: Bearer acc_live_99812401" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/checkout", "evaluateMeaningfulness": true}'`,
    nodeSnippet: `import { AccessAI } from '@accessai/sdk';

const client = new AccessAI({ apiKey: process.env.ACCESSAI_KEY });
const result = await client.scanner.analyzeUrl('https://example.com/checkout', {
  evaluateMeaningfulness: true
});
console.log('Accessibility Score:', result.metrics.score);`
  },
  {
    id: "vision-ocr",
    name: "Vision AI Text Reader & Explainer",
    method: "POST",
    path: "/api/v1/vision/read-explain",
    description: "Extracts text from uploaded images, synthesizes AI contextual explanations, and generates loud reading audio scripts.",
    requestPayload: {
      imageUrl: "https://storage.accessai.io/samples/prescription.jpg",
      outputFormat: "json+audio_url",
      generateAudioScript: true,
      targetAudience: "blind_user"
    },
    responsePayload: {
      status: "success",
      imageId: "img_309182",
      extractedText: "Amoxicillin 500mg - Take 1 capsule every 8 hours with food.",
      aiExplanation: "Medical prescription label for Amoxicillin 500mg to be taken three times daily with meals.",
      audioScript: "Attention. Medical prescription label detected for Amoxicillin 500 milligrams...",
      audioStreamUrl: "https://api.accessai.io/v1/audio/stream_8f9a0d.mp3"
    },
    curlSnippet: `curl -X POST https://api.accessai.io/v1/vision/read-explain \\
  -H "Authorization: Bearer acc_live_99812401" \\
  -F "image=@prescription.png" \\
  -F "generateAudioScript=true"`,
    nodeSnippet: `import { AccessAI } from '@accessai/sdk';

const client = new AccessAI({ apiKey: process.env.ACCESSAI_KEY });
const visionResult = await client.vision.readAndExplain('./prescription.png');
console.log('AI Audio Script:', visionResult.audioScript);`
  },
  {
    id: "live-caption-stream",
    name: "Live Meeting WebSocket Caption Stream",
    method: "WS",
    path: "wss://stream.accessai.io/v1/meetings/transcribe",
    description: "Real-time bi-directional WebSocket connection streaming live speech transcription (Whisper engine) with speaker identification.",
    requestPayload: {
      event: "audio_chunk",
      meetingId: "mtg_881920",
      speakerId: "Speaker 1",
      audioCodec: "opus/webm",
      sampleRate: 48000
    },
    responsePayload: {
      event: "caption_update",
      timestamp: "00:04:12",
      speaker: "Dr. Sarah Jenkins",
      transcript: "We are reviewing the quarterly web accessibility reports for compliance.",
      confidence: 0.985,
      isFinal: true
    },
    curlSnippet: `# Connect via wscat WebSocket CLI tool
wscat -c "wss://stream.accessai.io/v1/meetings/transcribe?token=acc_live_99812401"`,
    nodeSnippet: `import { AccessAIWebSocket } from '@accessai/sdk/ws';

const ws = new AccessAIWebSocket('mtg_881920', { apiKey: process.env.ACCESSAI_KEY });
ws.on('caption', (data) => {
  console.log(\`[\${data.speaker}]: \${data.transcript}\`);
});`
  }
];
