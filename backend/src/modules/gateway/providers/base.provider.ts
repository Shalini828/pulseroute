export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface GenerateResponse {
  text: string;

  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };

  finishReason?: string;
}

export interface ProviderMetadata {
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  defaultModel: string;
}

export abstract class BaseProvider {
  abstract readonly name: string;

  abstract readonly metadata: ProviderMetadata;

  abstract generate(
    request: GenerateRequest,
  ): Promise<GenerateResponse>;

  abstract generateStream(
    request: GenerateRequest,
    onChunk: (chunk: string) => void,
  ): Promise<GenerateResponse>;
}