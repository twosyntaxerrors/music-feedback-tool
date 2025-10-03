import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { GenerationConfig, Schema } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Maximum file size (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const SYSTEM_PROMPT = `# AUDIO ANALYSIS

Analyze the uploaded audio and return ONLY the following JSON structure:

{
  "track_type": "Vocal" or "Instrumental",
  "primary_genre": "Main genre based on actual musical elements heard",
  "secondary_influences": [
    "Include only if clearly and strongly present in the music",
    "Leave empty if nothing stands out"
  ],
  "key_instruments": [
    "List only instruments that are distinct and clearly audible",
    "Use specific terms (e.g. '808 bass' not 'bass')",
    "List by prominence"
  ],
  "mood_tags": [
    "2–3 word mood descriptors based on rhythm, harmony, and vibe"
  ],
  "scores": {
    "melody": "Integer 65–98",
    "harmony": "Integer 65–98",
    "rhythm": "Integer 65–98",
    "production": "Integer 65–98"
  },
  "strengths": [
    "2–3 standout musical aspects based purely on what is heard"
  ],
  "improvements": [
    "2–3 actionable suggestions based only on audible limitations"
  ],
  "analysis": {
    "composition": "2–3 sentences about melodic and harmonic content heard",
    "production": "2–3 sentences on clarity, mix balance, and noticeable effects",
    "arrangement": "2–3 sentences describing the structure and progression",
    "instrument_interplay": "2–3 sentences on how the audible instruments interact",
    "musical_journey": "2–3 sentences describing the track's sonic and emotional arc from beginning to end",
    "lyrics": "Only include this section for vocal tracks. For instrumental tracks, leave empty or exclude."
  },
  "visualization": {
    "type": "radar",
    "categories": ["Melody", "Harmony", "Rhythm", "Production"],
    "values": [melody_score, harmony_score, rhythm_score, production_score],
    "min": 65,
    "max": 98,
    "thresholds": [
      {"value": 70, "label": "Good"},
      {"value": 80, "label": "Very Good"},
      {"value": 90, "label": "Exceptional"}
    ]
  }
}

Return ONLY the JSON object with no explanations before or after.`;

type GeminiContentResponse = {
  text?: () => string;
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const REQUIRED_FIELDS: Array<string> = [
  "track_type",
  "primary_genre",
  "scores",
  "strengths",
  "improvements",
  "analysis",
];

function extractResponseText(response: GeminiContentResponse | undefined): string {
  if (!response) {
    return "";
  }

  try {
    if (typeof response.text === "function") {
      const direct = response.text();
      if (direct && direct.trim().length > 0) {
        return direct.trim();
      }
    }
  } catch (error) {
    console.warn("Failed to read response via text():", error);
  }

  const parts = response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part?.text?.trim())
    .filter((text): text is string => Boolean(text && text.length > 0));

  return parts && parts.length > 0 ? parts.join("\n").trim() : "";
}

function sanitizeJsonString(raw: string): string {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return "";
  }

  return cleaned.slice(start, end + 1);
}

function validateAnalysisPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Analysis payload was empty");
  }

  const missing = REQUIRED_FIELDS.filter((field) => (payload as Record<string, unknown>)[field] === undefined);

  if (missing.length > 0) {
    throw new Error(`Analysis payload missing required fields: ${missing.join(", ")}`);
  }

  return payload;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    console.debug("[audio-analysis] route entry", {
      authenticated: Boolean(userId),
      method: req.method,
      contentType: req.headers.get("content-type") || null,
    });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 20MB limit" }, { status: 400 });
    }

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an audio file." }, { status: 400 });
    }

    const requestMeta = {
      userId: userId || null,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type,
    };
    console.log("[audio-analysis] Received file", requestMeta);

    console.time("[audio-analysis] arrayBuffer");
    const buffer = await file.arrayBuffer();
    console.timeEnd("[audio-analysis] arrayBuffer");
    console.time("[audio-analysis] base64-encode");
    const base64String = Buffer.from(buffer).toString("base64");
    console.timeEnd("[audio-analysis] base64-encode");

    console.log("[audio-analysis] Payload sizes", {
      binaryBytes: buffer.byteLength,
      base64Chars: base64String.length,
    });

    const signedInModelId = "gemini-2.5-pro";
    const guestModelId = "gemini-2.5-flash";
  const responseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      track_type: { type: SchemaType.STRING },
      primary_genre: { type: SchemaType.STRING },
      secondary_influences: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      key_instruments: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      mood_tags: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      scores: {
        type: SchemaType.OBJECT,
        properties: {
          melody: { type: SchemaType.INTEGER },
          harmony: { type: SchemaType.INTEGER },
          rhythm: { type: SchemaType.INTEGER },
          production: { type: SchemaType.INTEGER },
        },
        required: ["melody", "harmony", "rhythm", "production"],
      },
      strengths: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      improvements: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      analysis: {
        type: SchemaType.OBJECT,
        properties: {
          composition: { type: SchemaType.STRING },
          production: { type: SchemaType.STRING },
          arrangement: { type: SchemaType.STRING },
          instrument_interplay: { type: SchemaType.STRING },
          musical_journey: { type: SchemaType.STRING },
          lyrics: { type: SchemaType.STRING },
        },
        required: [
          "composition",
          "production",
          "arrangement",
          "instrument_interplay",
          "musical_journey",
        ],
      },
      visualization: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          categories: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          values: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.NUMBER },
          },
          min: { type: SchemaType.INTEGER },
          max: { type: SchemaType.INTEGER },
          thresholds: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                value: { type: SchemaType.INTEGER },
                label: { type: SchemaType.STRING },
              },
              required: ["value", "label"],
            },
          },
        },
      },
    },
    required: [
      "track_type",
      "primary_genre",
      "scores",
      "strengths",
      "improvements",
      "analysis",
    ],
  };

  const generationConfig: GenerationConfig = {
    temperature: 0.1,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
    responseSchema,
  };

    // Choose model based on auth: Pro for signed-in, Flash for guests
    let usedModelId = userId ? signedInModelId : guestModelId;
    let result;

    try {
      const modelPrimary = genAI.getGenerativeModel({
        model: usedModelId,
        generationConfig,
      });

      console.time(`[audio-analysis] ${usedModelId} generateContent`);
      result = await modelPrimary.generateContent([
        {
          inlineData: {
            mimeType: file.type,
            data: base64String,
          },
        },
        { text: "Analyze this audio file and provide feedback in the specified JSON format." },
        { text: SYSTEM_PROMPT },
      ]);
      console.timeEnd(`[audio-analysis] ${usedModelId} generateContent`);
    } catch (primaryError) {
      const fallbackModelId = userId ? "gemini-2.5-flash" : "gemini-2.5-flash";
      console.warn(
        `[audio-analysis] Primary model failed (${usedModelId}); attempting fallback (${fallbackModelId}).`,
        primaryError,
      );

      usedModelId = fallbackModelId;
      const modelFallback = genAI.getGenerativeModel({
        model: fallbackModelId,
        generationConfig,
      });

      console.time(`[audio-analysis] ${fallbackModelId} generateContent`);
      result = await modelFallback.generateContent([
        {
          inlineData: {
            mimeType: file.type,
            data: base64String,
          },
        },
        { text: "Analyze this audio file and provide feedback in the specified JSON format." },
        { text: SYSTEM_PROMPT },
      ]);
      console.timeEnd(`[audio-analysis] ${fallbackModelId} generateContent`);
    }

    console.log("[audio-analysis] Model response received", {
      hasResponse: Boolean(result?.response),
      candidateCount: result?.response?.candidates?.length ?? 0,
      model: usedModelId,
    });

    const response = result.response as GeminiContentResponse | undefined;
    const rawText = extractResponseText(response);

    if (!rawText) {
      throw new Error("AI response did not contain any text output");
    }

    const jsonString = sanitizeJsonString(rawText);
    if (!jsonString) {
      console.error("[audio-analysis] sanitizeJsonString produced empty string. Raw response preview:", rawText.slice(0, 500));
    }

    if (!jsonString) {
      throw new Error("Could not locate JSON object in the AI response");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      const err = e as Error & { message?: string };
      // Try to extract the position from the error message if present
      const match = err.message?.match(/position (\d+)/i);
      const pos = match ? Number(match[1]) : -1;
      const contextStart = Math.max(0, pos - 80);
      const contextEnd = Math.min(jsonString.length, pos + 80);
      const contextSnippet = jsonString.slice(contextStart, contextEnd);
      const charAt = pos >= 0 ? jsonString.charAt(pos) : undefined;
      const charCode = pos >= 0 ? jsonString.charCodeAt(pos) : undefined;
      console.error("[audio-analysis] JSON.parse failed", {
        error: err.message,
        pos,
        contextSnippet,
        charAt,
        charCode,
        jsonPreviewStart: jsonString.slice(0, 200),
        jsonPreviewEnd: jsonString.slice(-200),
      });
      throw e;
    }

    const analysisData = validateAnalysisPayload(parsed);

    // Add flag to indicate that AI comments should be generated separately
    const responseData = {
      ...analysisData,
      hasAIComments: false,
      commentsEndpoint: '/api/gemini/audio-comments',
      modelUsed: usedModelId,
      accessLevel: userId ? 'pro' : 'guest'
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing audio:", error);

    const errorMessage = error instanceof Error ? error.message : "Error processing audio file";

    // Check for rate limiting errors
    const isRateLimitError = errorMessage.includes("429") ||
                            errorMessage.includes("rate limit") ||
                            errorMessage.includes("too many requests") ||
                            errorMessage.includes("quota exceeded");

    const isQuotaExceeded = errorMessage.includes("quota") ||
                           errorMessage.includes("limit exceeded") ||
                           errorMessage.includes("daily limit");

    let statusCode = 500;
    let errorType = "UNKNOWN_ERROR";
    let userMessage = "Something went wrong while analyzing your audio file. Please try again.";

    if (isRateLimitError) {
      statusCode = 429;
      errorType = "RATE_LIMIT_EXCEEDED";
      userMessage = "Too many requests. Please wait a moment before trying again.";
    } else if (isQuotaExceeded) {
      statusCode = 429;
      errorType = "QUOTA_EXCEEDED";
      userMessage = "Daily API quota exceeded. Please try again tomorrow.";
    } else {
      // Check for other common API errors
      if (errorMessage.includes("400")) {
        statusCode = 400;
        errorType = "INVALID_REQUEST";
        userMessage = "Invalid request. Please check your file and try again.";
      } else if (errorMessage.includes("413")) {
        statusCode = 413;
        errorType = "FILE_TOO_LARGE";
        userMessage = "File is too large. Please upload a smaller file (max 20MB).";
      } else if (errorMessage.includes("415")) {
        statusCode = 415;
        errorType = "UNSUPPORTED_FORMAT";
        userMessage = "Unsupported file format. Please upload an audio file.";
      }
    }

    return NextResponse.json(
      {
        error: userMessage,
        errorType: errorType,
        details:
          process.env.NODE_ENV !== "production" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: statusCode },
    );
  }
}
