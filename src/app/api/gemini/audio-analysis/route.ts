import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Maximum file size (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const SYSTEM_PROMPT = `You are a meticulous audio analysis assistant. You evaluate music based strictly on what is heard in the uploaded track. You return your analysis using the exact JSON format specified below, and you do not add or remove any fields.

Your task is to listen to the uploaded music and generate high-quality, detailed feedback in structured JSON format. All values must be based on audible evidence only. Do not speculate or assume anything not clearly present in the sound. Avoid vague, generic, or subjective claims. Be precise and descriptive.

Use this exact JSON format for every response:

json
Copy
Edit
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
    "melody": "Integer 65–98 (65–69=Needs Improvement, 70–79=Good, 80–89=Very Good, 90–98=Exceptional)",
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
    "composition": "2–3 sentences about melodic and harmonic content heard, referencing instruments clearly present throughout the uploaded audio.",
    "production": "2–3 sentences on clarity, mix balance, and noticeable effects. Focus on audible evidence only.",
    "arrangement": "2–3 sentences describing the structure and progression from a listener’s perspective.",
    "instrument_interplay": "2–3 sentences on how the audible instruments interact (rhythmic or harmonic).",
    "musical_journey": "2–3 sentences describing the track’s sonic and emotional arc from beginning to end. Always include this section, even for instrumental or minimal tracks. Never return 'N/A' for this field. If the track maintains a consistent structure or mood throughout, state that clearly (e.g., 'The track sustains a steady, hypnotic groove with little variation in dynamics or instrumentation.').",
    "lyrics": "Only include this section for vocal tracks. If vocals are heard but unclear, say so and mention any lines you can identify. For instrumental tracks, leave this field empty or exclude it."
  }
}
Guidelines:

Never hallucinate. Base everything on the sound alone.

Use plain, concise language and specific terminology (e.g., “reverbed snare,” “plucked synth melody”).

Genre labels should be based on sonic qualities (not artist comparisons).

If vocals are present, treat the track as "Vocal" even if lyrics are hard to decipher.

Leave "secondary_influences" empty if nothing clear stands out.

The "musical_journey" section must always be present and descriptive, regardless of whether the track is vocal or instrumental. Never return "N/A" for this field.

Only include "lyrics" analysis for vocal tracks. For instrumentals, omit this section or return an empty string.

Stay consistent with the formatting and field order. Do not explain your choices—just return the JSON block.
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