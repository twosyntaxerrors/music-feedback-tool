import { GoogleGenerativeAI } from "@google/generative-ai";
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

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      userId,
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

    const primaryModelId = "gemini-2.5-pro";
    const fallbackModelId = "gemini-2.5-flash";
    const generationConfig = {
      temperature: 0.1,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    } as const;

    let usedModelId = primaryModelId;
    let result;

    try {
      const modelPrimary = genAI.getGenerativeModel({
        model: primaryModelId,
        generationConfig,
      });

      console.time(`[audio-analysis] ${primaryModelId} generateContent`);
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
      console.timeEnd(`[audio-analysis] ${primaryModelId} generateContent`);
    } catch (primaryError) {
      console.warn(
        `[audio-analysis] Primary model failed (${primaryModelId}); attempting fallback (${fallbackModelId}).`,
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
      throw new Error("Could not locate JSON object in the AI response");
    }

    const analysisData = validateAnalysisPayload(JSON.parse(jsonString));

    // Add flag to indicate that AI comments should be generated separately
    const responseData = {
      ...analysisData,
      hasAIComments: false,
      commentsEndpoint: '/api/gemini/audio-comments'
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

    if (errorMessage === "Unauthorized") {
      statusCode = 401;
      errorType = "UNAUTHORIZED";
      userMessage = "Authentication required. Please sign in to continue.";
    } else if (isRateLimitError) {
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
