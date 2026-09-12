import { gemini } from "@/lib/gemini";

import {
  aiGeneratedJobDescriptionSchema,
  type AIJobDescriptionFields,
  type AIGeneratedJobDescription,
} from "./ai.validation";

import { buildJobDescriptionPrompt } from "./ai.prompt";

export async function generateJobDescription(
  input: AIJobDescriptionFields,
): Promise<AIGeneratedJobDescription> {
  const prompt = buildJobDescriptionPrompt(input);

  const response = await gemini.models.generateContent({
    model: "gemini-3.6-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          description: {
            type: "string",
            description:
              "A complete professional job description ready for recruiter review.",
          },
        },

        required: ["description"],
      },
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  return aiGeneratedJobDescriptionSchema.parse(parsed);
}
