import {
  AIGeneratedJobDescription,
  AIJobDescriptionFields,
} from "@/modules/ai/ai.validation";

interface AIJobDescriptionResponse {
  success: boolean;
  data?: AIGeneratedJobDescription;
  message?: string;
}

export async function generateAIJobDescription(
  input: AIJobDescriptionFields,
): Promise<AIGeneratedJobDescription> {
  const response = await fetch("/api/ai/job-description", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as AIJobDescriptionResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Failed to generate job description");
  }

  return result.data;
}
