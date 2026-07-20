import { z } from "zod";

export const gatewayRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
});

export type GatewayRequestInput = z.infer<typeof gatewayRequestSchema>;