import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Maximum file size (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const SYSTEM_PROMPT = `You are an expert music critic and audio engineer. Your task is to carefully listen to the provided audio file and provide accurate, non-hallucinated feedback based ONLY on what is clearly audible in the recording. If anything is unclear or masked in the mix, DO NOT guess — it is better to omit than to assume.

Return your analysis in the following JSON structure:

{
  "track_type": "Vocal" or "Instrumental" (this must be determined first),
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
    "2-3 word mood descriptors based on rhythm, harmony, and vibe"
  ],
  "scores": {
    "melody": number from 65 to 98,
    "harmony": number from 65 to 98,
    "rhythm": number from 65 to 98,
    "production": number from 65 to 98
  },
  "strengths": [
    "Highlight 2–3 musical elements that clearly stand out in this track"
  ],
  "improvements": [
    "Offer 2–3 specific and actionable suggestions based only on audible issues"
  ],
  "analysis": {
    "composition": "Discuss melodic and harmonic choices you clearly hear. Stay objective. Talk about the beginning, the middle and the end, specifically referencing the instruments used.",
    "production": "Discuss clarity, mix balance, and noticeable effects. Focus on *what is heard*, not assumed.",
    "arrangement": "Describe structure and progression, based only on audible cues.",
    "instrument_interplay": "Explain how clearly-audible instruments work together rhythmically or harmonically.",
    "lyrics": "ONLY for vocal tracks. Do NOT hallucinate or guess lyrics. Instead: (1) If lyrics are clear, quote 2–3 standout lines from different parts of the song. (2) If lyrics are hard to decipher, say so — and explain why (e.g. 'vocals are heavily autotuned or low in the mix'). If the lyrics are hard to decipher, infer still — but acknowledge that accuracy might be off. For each quoted line: explain its meaning and comment on the vocal delivery style."
  }
}

Important Instructions:
1. DO NOT GUESS. Only report what you can hear with confidence.
2. If a lyric is unclear or slurred, do not quote or infer it.
3. For vocals, it is OK to say: "Lyrics are difficult to fully interpret due to vocal effects or mix clarity."
4. Scores should reflect actual quality:
   - 90–98 = Exceptional
   - 80–89 = Very Good
   - 70–79 = Good
   - 65–69 = Needs Improvement
5. All text fields must return simple strings (no nested arrays or objects inside fields).
6. Keep analysis sections concise — 2–3 sentences per field is ideal.
7. If you're unsure, leave a field blank or say "Not clearly audible" instead of filling with assumptions.
8. Do not embellish. This tool is meant for serious critique based ONLY on audio content.
`;

export async function POST(req: NextRequest) {
  try {
    console.log("Starting audio analysis request");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.log("File size exceeds limit:", file.size);
      return NextResponse.json(
        { error: "File size exceeds 20MB limit" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('audio/')) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Please upload an audio file." },
        { status: 400 }
      );
    }

    console.log("Processing file:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString("base64");

    console.log("File converted to base64");

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log("Sending request to Gemini API");

    // Generate content using the audio file
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64String
        }
      },
      { text: "Analyze this audio file and provide feedback in the specified JSON format." },
      { text: SYSTEM_PROMPT }
    ]);

    console.log("Received response from Gemini API");

    const response = await result.response;
    const text = response.text();

    console.log("Raw response text:", text);

    try {
      // Try parsing the entire response as JSON first
      const analysisData = JSON.parse(text);

      // Validate the structure
      if (!analysisData.track_type || !analysisData.scores || !analysisData.strengths) {
        throw new Error("Incomplete analysis data");
      }

      return NextResponse.json(analysisData);
    } catch (parseError) {
      // If direct parsing fails, try to find and parse JSON within the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not find valid JSON in the AI response");
      }

      const analysisData = JSON.parse(jsonMatch[0]);

      // Validate the structure
      if (!analysisData.track_type || !analysisData.scores || !analysisData.strengths) {
        throw new Error("Incomplete analysis data");
      }

      return NextResponse.json(analysisData);
    }

  } catch (error) {
    console.error("Error processing audio:", error);
    let errorMessage = "Error processing audio file";
    let errorDetails = undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
      
      // Check for specific Gemini API errors
      if (error.message.includes("API_KEY")) {
        errorMessage = "Invalid or missing API key";
      } else if (error.message.includes("PERMISSION_DENIED")) {
        errorMessage = "API access denied. Please check your API key permissions.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage = "The AI provided an invalid response format. Please try again.";
      } else if (error.message.includes("Incomplete analysis")) {
        errorMessage = "The analysis was incomplete. Please try again.";
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 