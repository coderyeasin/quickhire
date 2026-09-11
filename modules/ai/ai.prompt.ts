import { AIJobDescriptionFields } from "./ai.validation";

export function buildJobDescriptionPrompt(input: AIJobDescriptionFields) {
  return `
You are an experienced technology recruitment content writer.

Your task is to create a professional job description for a technology recruitment platform.

Use ONLY the information provided below.

JOB INFORMATION

Job Title:
${input.title}

Company:
${input.company}

Categories:
${input.category.join(", ")}

Location:
${input.location}

Job Type:
${input.type}

Salary:
${input.salary ?? "Negotiable"}

Required Skills:
${input.skills.join(", ")}


WRITING REQUIREMENTS

1. Write a professional, realistic and attractive job description.

2. The description is intended for a technology recruitment platform.

3. Keep the content relevant to the provided job title and skills.

4. Do not invent technologies that are not included in the provided information.

5. Do not invent company history, company culture, salary amounts, benefits,
   office facilities, team size, funding, or other company information.

6. Do not invent years of experience because no experience field is provided.

7. Do not make promises about employment.

8. Do not include discriminatory or exclusionary requirements.

9. Do not include unnecessary buzzwords.

10. Keep the writing concise enough for a real job listing.

11. Clearly organize the description into:
   - About the Role
   - Responsibilities
   - Requirements
   - Preferred Qualifications

12. Responsibilities must be realistic for the job title.

13. Requirements must be based primarily on the provided skills.

14. Preferred qualifications should only be included when they can reasonably
    be inferred from the provided job information. Otherwise return a short
    list or empty section.

15. Do not include Markdown code fences.

16. Return ONLY the requested JSON structure.

The final description should be ready for a recruiter to review,
edit if necessary, and publish.
`;
}
