import { NextRequest, NextResponse } from "next/server";

// COMMENTED OUT: AI Comments feature temporarily disabled for refinement
// TODO: Re-enable after fine-tuning the AI comments generation

/*
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);
*/

/*
const AI_COMMENTS_SYSTEM_PROMPT = `# AI COMMENT GENERATOR

You are an AI assistant that generates engaging, hype-style comments for music tracks based on analysis data.

Your task is to generate a JSON array of temporal annotations that include:
- Short, energetic fan-style comments
- Technical analysis comments
- Genre-specific insights
- Production highlights

## OUTPUT FORMAT

Return ONLY a JSON array of comment objects with this structure:

[
  {
    "id": "structure-0",
    "timestamp": 15.5,
    "type": "structure",
    "title": "Intro",
    "description": "This intro is absolutely fire 🔥",
    "color": "bg-indigo-500/20 border-indigo-400/40 text-indigo-300",
    "avatarColor": "bg-indigo-500",
    "intensity": 0.8,
    "category": "structure"
  },
  {
    "id": "instrument-0",
    "timestamp": 45.2,
    "type": "instrument",
    "title": "808 bass",
    "description": "These 808s are absolutely destroying everything 💥",
    "color": "bg-blue-500/20 border-blue-400/40 text-blue-300",
    "avatarColor": "bg-blue-500",
    "intensity": 0.9,
    "category": "instrument"
  }
]

## COMMENT TYPES

1. **structure**: Comments about song sections (intro, verse, chorus, bridge, outro)
2. **instrument**: Comments about specific instruments and their impact
3. **mood**: Comments about the emotional atmosphere and energy
4. **rhythm**: Comments about groove, timing, and rhythmic elements
5. **production**: Comments about mix quality and production techniques
6. **genre**: Comments about genre characteristics and influences

## COMMENT STYLE

- Keep comments short and punchy (10-20 words max)
- Use hype language: "fire 🔥", "absolutely insane", "destroying", "legendary"
- Include relevant emojis sparingly
- Sound like excited music fans or producers
- Mix technical and emotional language
- Vary the intensity and timestamps

## TIMING

- Distribute comments throughout the track duration
- Use the track_duration to calculate appropriate timestamps
- Ensure chronological order

Return ONLY the JSON array with no explanations before or after.`;

type AICommentRequest = {
  analysis: any;
  trackDuration: number;
};
*/

/*
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { analysis, trackDuration }: AICommentRequest = body;

    if (!analysis || !trackDuration) {
      return NextResponse.json({ error: "Missing analysis or track duration" }, { status: 400 });
    }

    console.log("[audio-comments] Generating AI comments for track:", {
      duration: trackDuration,
      genre: analysis.primary_genre,
      instruments: analysis.key_instruments?.length || 0
    });

    const primaryModelId = "gemini-2.5-pro";
    const fallbackModelId = "gemini-2.5-flash";
    const generationConfig = {
      temperature: 0.3,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 4096,
    } as const;

    const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let usedModelId = primaryModelId;
    let result;

    try {
      const modelPrimary = genAI.getGenerativeModel({
        model: primaryModelId,
        generationConfig,
      });

      const timeLabelPrimary = `[audio-comments] ${primaryModelId} generateContent ${requestId}`;
      console.time(timeLabelPrimary);
      result = await modelPrimary.generateContent([
        { text: `Generate engaging AI comments for this music track based on the analysis data. Track duration is ${trackDuration} seconds.` },
        { text: JSON.stringify(analysis, null, 2) },
        { text: AI_COMMENTS_SYSTEM_PROMPT },
      ]);
      console.timeEnd(timeLabelPrimary);
    } catch (primaryError) {
      console.warn(
        `[audio-comments] Primary model failed (${primaryModelId}); attempting fallback (${fallbackModelId}).`,
        primaryError,
      );

      usedModelId = fallbackModelId;
      const modelFallback = genAI.getGenerativeModel({
        model: fallbackModelId,
        generationConfig,
      });

      const timeLabelFallback = `[audio-comments] ${fallbackModelId} generateContent ${requestId}`;
      console.time(timeLabelFallback);
      result = await modelFallback.generateContent([
        { text: `Generate engaging AI comments for this music track based on the analysis data. Track duration is ${trackDuration} seconds.` },
        { text: JSON.stringify(analysis, null, 2) },
        { text: AI_COMMENTS_SYSTEM_PROMPT },
      ]);
      console.timeEnd(timeLabelFallback);
    }

    console.log("[audio-comments] Model response received", {
      hasResponse: Boolean(result?.response),
      candidateCount: result?.response?.candidates?.length ?? 0,
      model: usedModelId,
    });

    const responseText = result.response?.text();
    if (!responseText) {
      throw new Error("AI comments response did not contain any text output");
    }

    // Extract JSON array from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not locate JSON array in the AI comments response");
    }

    const commentsData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      comments: commentsData,
      success: true
    });
  } catch (error) {
    console.error("Error generating AI comments:", error);

    const errorMessage = error instanceof Error ? error.message : "Error generating AI comments";

    // Check for rate limiting errors
    const isRateLimitError = errorMessage.includes("429") ||
                            errorMessage.includes("rate limit") ||
                            errorMessage.includes("too many requests") ||
                            errorMessage.includes("quota exceeded");

    const isQuotaExceeded = errorMessage.includes("quota") ||
                           errorMessage.includes("limit exceeded") ||
                           errorMessage.includes("daily limit");

    let statusCode = 500;
    let userMessage = "Error generating AI comments. Please try again.";

    if (isRateLimitError) {
      statusCode = 429;
      userMessage = "Too many requests. Please wait a moment before trying again.";
    } else if (isQuotaExceeded) {
      statusCode = 429;
      userMessage = "Daily API quota exceeded. Please try again tomorrow.";
    }

    return NextResponse.json(
      {
        error: userMessage,
        success: false,
        errorType: isRateLimitError ? "RATE_LIMIT_EXCEEDED" : isQuotaExceeded ? "QUOTA_EXCEEDED" : "UNKNOWN_ERROR",
        details:
          process.env.NODE_ENV !== "production" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: statusCode },
    );
  }
}
*/

// Temporary placeholder response for disabled feature
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      error: "AI Comments feature is temporarily disabled for refinement",
      errorType: "FEATURE_DISABLED"
    },
    { status: 503 }
  );
}
