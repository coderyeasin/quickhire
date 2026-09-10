import { JobDescriptionInput } from "./ai.validation";

export function buildJobDescriptionPrompt(input: JobDescriptionInput) {
  return `
Create a professional, realistic job description for a technology recruitment platform.

JOB INFORMATION

Title:
${input.title}

Company:
${input.company ?? "Not specified"}

Category:
${input.category.join(", ")}

Location:
${input.location ?? "Not specified"}

Employment Type:
${input.type ?? "Not specified"}

Salary:
${input.salary ?? "Negotiable"}

Experience:
${input.experience ?? "Not specified"}

Skills:
${input.skills.join(", ")}

INSTRUCTIONS

1. Write a complete and professional job description suitable for publishing on a technology recruitment platform.

2. The generated content will be stored in a single "description" field, so return one well-structured description rather than separate JSON fields.

3. Organize the description using clear sections such as:
   - Overview
   - Responsibilities
   - Requirements
   - Preferred Skills
   - Benefits

4. Only mention technologies, frameworks, tools, qualifications, or skills that are provided in the job information. Do not invent specific technologies.

5. Use the provided job title, category, employment type, location, experience, and skills to make the responsibilities and requirements relevant to the role.

6. Do not invent specific salary amounts, benefits, company facts, working arrangements, or other information that was not provided.

7. If salary is "Negotiable", you may mention that compensation is negotiable, but do not create a salary range.

8. If experience is not specified, do not invent a required number of years.

9. Responsibilities should describe realistic duties appropriate for the specified role and technology stack.

10. Requirements should focus on capabilities reasonably expected from the provided role and skills.

11. Keep required skills and preferred skills logically distinct. Do not incorrectly make every skill a mandatory requirement.

12. Use concise, clear, natural language. Avoid excessive buzzwords, exaggerated claims, and generic marketing language.

13. Keep the description inclusive and professional. Do not discriminate based on age, gender, race, religion, nationality, disability, or other protected characteristics.

14. Do not make employment decisions, rank candidates, or evaluate candidate suitability.

15. Do not include application instructions, contact information, or information that was not provided in the job information.

16. Do not use emojis.

17. Return only the generated job description text. Do not return JSON, explanations, comments, or additional notes.
`;
}
