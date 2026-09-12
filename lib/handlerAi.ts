import {
  AIGeneratedJobDescription,
  AIJobDescriptionFields,
} from "@/modules/ai/ai.validation";
import type { SharedJobFormValues } from "@/types/interfaces";

import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";

type SetAIError = (error: string | null) => void;
type SetGenerating = (isGeneratingAI: boolean) => void;
type SetGeneratedDescription = (generatedDescription: string | null) => void;

type GenerateAIJobDescription = (
  input: AIJobDescriptionFields,
) => Promise<AIGeneratedJobDescription>;

// GENERATE AI DESCRIPTION

export const handleGeneratedAIContent = async (
  getValues: UseFormGetValues<SharedJobFormValues>,
  setAIError: SetAIError,
  setIsGeneratingAI: SetGenerating,
  generateAIJobDescription: GenerateAIJobDescription,
  setGeneratedDescription: SetGeneratedDescription,
) => {
  setAIError(null);

  const values = getValues();

  // Validate required AI inputs
  if (!values.title?.trim()) {
    setAIError("Please enter a job title first.");
    return;
  }

  if (!values.company?.trim()) {
    setAIError("Please enter the company name first.");
    return;
  }

  if (!values.category?.trim()) {
    setAIError("Please enter at least one category first.");
    return;
  }

  if (!values.location?.trim()) {
    setAIError("Please enter the job location first.");
    return;
  }

  if (!values.skills?.trim()) {
    setAIError("Please enter at least one required skill first.");
    return;
  }

  // Convert comma-separated category into array
  const category = values.category
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  // Convert comma-separated skills into array
  const skills = values.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (category.length === 0) {
    setAIError("Please enter at least one category.");
    return;
  }

  if (skills.length === 0) {
    setAIError("Please enter at least one required skill.");
    return;
  }

  try {
    setIsGeneratingAI(true);

    const result = await generateAIJobDescription({
      title: values.title.trim(),
      company: values.company.trim(),
      category,
      location: values.location.trim(),
      type: values.type,
      salary: values.salary?.trim() || "Negotiable",
      skills,
    });

    setGeneratedDescription(result.description);
  } catch (error) {
    console.error("AI job description generation failed:", error);

    setAIError(
      error instanceof Error
        ? error.message
        : "Unable to generate job description. Please try again.",
    );
  } finally {
    setIsGeneratingAI(false);
  }
};

// USE AI DESCRIPTION

export const handleAIDescriptionContent = (
  generatedDescription: string | null,
  setValue: UseFormSetValue<SharedJobFormValues>,
  setGeneratedDescription: SetGeneratedDescription,
  setAIError: SetAIError,
) => {
  if (!generatedDescription) return;

  setValue("description", generatedDescription, {
    shouldDirty: true,
    shouldValidate: true,
  });

  setGeneratedDescription(null);
  setAIError(null);
};

// DISCARD AI DESCRIPTION

export const handleCancelAI = (
  setGeneratedDescription: SetGeneratedDescription,
  setAIError: SetAIError,
) => {
  setGeneratedDescription(null);
  setAIError(null);
};
