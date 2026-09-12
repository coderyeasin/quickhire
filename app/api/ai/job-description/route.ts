import { NextResponse } from "next/server";

import { generateJobDescription } from "@/modules/ai/ai.service";
import { aiJobDescriptionFieldsSchema } from "@/modules/ai/ai.validation";

function isTransientGeminiError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const status = "status" in error ? error.status : undefined;
  return status === 429 || status === 500 || status === 503;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input = aiJobDescriptionFieldsSchema.parse(body);

    const result = await generateJobDescription(input);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("AI job description generation error:", error);

    const isTransientError = isTransientGeminiError(error);

    return NextResponse.json(
      {
        success: false,
        message: isTransientError
          ? "Gemini is temporarily busy. Please try again in a moment."
          : "Unable to generate the job description. Please try again.",
      },
      {
        status: isTransientError ? 503 : 500,
      },
    );
  }
}
