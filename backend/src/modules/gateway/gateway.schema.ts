import { z } from 'zod';

// Schema for validating incoming gateway requests.
export const gatewayRequestSchema = z.object({
  provider: z.string().trim().min(1, 'Provider is required'),
  prompt: z.string().trim().min(1, 'Prompt is required'),
});

// Inferred input type for gateway requests.
export type GatewayRequestInput = z.infer<typeof gatewayRequestSchema>;
