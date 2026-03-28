export function buildSprintGenerationPrompt(params: {
  projectName: string
  projectDescription: string
  projectType?: string
  mvpDefinition: unknown
}) {
  const { projectName, projectDescription, projectType, mvpDefinition } = params

  return `
You are a senior startup CTO and product engineer.

Your job is to convert an MVP definition into a structured execution plan using development sprints.

Project:
- Name: ${projectName}
- Description: ${projectDescription}
- Type: ${projectType ?? "N/A"}

MVP Definition:
${JSON.stringify(mvpDefinition, null, 2)}

Instructions:

1. Create a realistic execution plan for a solo developer.
2. Organize the work into 3 to 6 sprints.
3. Each sprint must represent meaningful progress toward a working MVP.
4. Follow this order:
   - foundation
   - auth / database
   - core features
   - integrations / AI
   - polish / deploy

Rules:
- Tasks must be concrete and executable
- Avoid vague tasks
- Each task must have acceptance criteria

Return ONLY valid JSON.

{
  "sprints": [
    {
      "sprint_number": 1,
      "title": "string",
      "goal": "string",
      "summary": "string",
      "estimated_days": 5,
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "task_type": "frontend | backend | db | auth | integration | ai | qa | deploy",
          "priority": "low | medium | high",
          "estimated_hours": 4,
          "acceptance_criteria": "string"
        }
      ]
    }
  ]
}
`
}