import { z } from "zod";

export const gatewayRequestSchema = z.object({
  provider: z.string().optional(),
  projectId: z.string().optional(),
  endpoint: z.literal("/chat/completions"),

  payload: z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string().min(1),
        })
      )
      .min(1),

    model: z.string().optional(),

    temperature: z.number().optional(),

    maxTokens: z.number().optional(),

    stream: z.boolean().optional(),
  }),
});

export type GatewayRequestInput = z.infer<
  typeof gatewayRequestSchema
>;