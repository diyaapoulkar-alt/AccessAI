/**
 * Groq API Service for AccessAI Platform (Powered by Llama 3.2 11B Vision & Llama 3.3 70B)
 * Architected by Diya Poulkar
 */

export const getGroqApiKey = () => {
  return localStorage.getItem('accessai_groq_api_key') || localStorage.getItem('saathi_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
};

export const setGroqApiKey = (key) => {
  localStorage.setItem('accessai_groq_api_key', key.trim());
};

/**
 * Direct REST caller to Groq OpenAI-compatible endpoint
 */
async function callGroqApi(model, messages, temperature = 0.3, maxTokens = 1000) {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    console.warn("Groq API key not found. Using intelligent fallback mode.");
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Groq API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Call Error:", error);
    throw error;
  }
}

/**
 * Vision AI: Verbatim High-Accuracy OCR Extraction with Llama 3.2 11B Vision
 */
export async function extractRawTextWithGroqVision(imageBase64) {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const messages = [
    {
      role: "system",
      content: "You are an expert verbatim OCR text extractor. Your ONLY goal is to transcribe every single printed, typed, or handwritten word, number, sign, label, and table entry from the provided image EXACTLY as written, line by line. Do NOT summarize, explain, or interpret. Return ONLY the verbatim transcribed text."
    },
    {
      role: "user",
      content: [
        { type: "text", text: "Transcribe all text from this image verbatim without summarizing or altering words:" },
        {
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
          }
        }
      ]
    }
  ];

  return await callGroqApi("llama-3.2-11b-vision-preview", messages, 0.1, 4096);
}

/**
 * Vision AI: Synthesize Plain-Language AI Explanation for Visually Impaired Users
 */
export async function describeImageWithGroq(imageBase64, userPrompt = "Describe this image clearly for a blind or visually impaired user. Extract key information, warnings, dosage, or due dates.") {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const messages = [
    {
      role: "system",
      content: "You are an expert accessibility vision assistant for blind users. Synthesize clear, structured plain-language context explanations for screen readers and text-to-speech audio."
    },
    {
      role: "user",
      content: [
        { type: "text", text: userPrompt },
        {
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
          }
        }
      ]
    }
  ];

  return await callGroqApi("llama-3.2-11b-vision-preview", messages, 0.2, 2048);
}

/**
 * AI Context Explainer & Multilingual Simplifier
 */
export async function simplifyTextWithGroq(sourceText, readingLevel = 'elementary', targetLanguage = 'en') {
  const levelDescriptions = {
    elementary: "Rewrite using simple words suitable for a 5th-grade reading level. Break down long complex sentences into short clear statements.",
    highschool: "Rewrite at a high-school level focusing on clarity, key definitions, and clean structure.",
    audio: "Format as bullet points optimized specifically for audio text-to-speech reading with clear pauses and simple vocabulary."
  };

  const langPrompts = {
    en: "Output in English.",
    hi: "Translate and output the simplified text in Hindi (हिंदी). Use clear, easy Hindi words.",
    mr: "Translate and output the simplified text in Marathi (मराठी)."
  };

  const systemInstruction = `You are AccessAI Context Explainer.
Goal: Take the user's extracted text and simplify it.
Level: ${levelDescriptions[readingLevel] || levelDescriptions.elementary}
Language: ${langPrompts[targetLanguage] || langPrompts.en}
Rely ONLY on facts stated in the source text. Do NOT hallucinate.`;

  const messages = [
    { role: "system", content: systemInstruction },
    { role: "user", content: `Please simplify and format the following text:\n\n${sourceText}` }
  ];

  return await callGroqApi("llama-3.3-70b-versatile", messages, 0.3, 2048);
}
