import { z } from "zod"

/* ============================= */
/* TASK SCHEMA */
/* ============================= */

export const SprintTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  task_type: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  estimated_hours: z.number().nullable().optional(),
  acceptance_criteria: z.string().nullable().optional(),
})

export type SprintTask = z.infer<typeof SprintTaskSchema>

/* ============================= */
/* SPRINT SCHEMA */
/* ============================= */

export const SprintSchema = z.object({
  sprint_number: z.number(),
  title: z.string(),
  goal: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  estimated_days: z.number().nullable().optional(),
  tasks: z.array(SprintTaskSchema),
})

export type Sprint = z.infer<typeof SprintSchema>

/* ============================= */
/* ROOT RESPONSE SCHEMA */
/* ============================= */

export const SprintGenerationResponseSchema = z.object({
  sprints: z.array(SprintSchema),
})

export type SprintGenerationResponse = z.infer<
  typeof SprintGenerationResponseSchema
>

/* ============================= */
/* MAIN VALIDATION FUNCTION */
/* ============================= */

export function parseAndValidateSprintResponse(
  input: unknown
): SprintGenerationResponse {
  try {
    return SprintGenerationResponseSchema.parse(input)
  } catch (error) {
    console.error("❌ Zod validation error:", error)
    throw new Error("Invalid sprint structure from AI")
  }
}