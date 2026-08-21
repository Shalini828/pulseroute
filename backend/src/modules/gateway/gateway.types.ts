export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GatewayRequest {
  provider?: string;
  projectId?: string;
  endpoint: "/chat/completions";

  payload: {
    messages: ChatMessage[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface GatewayResponse {
  success: boolean;
  jobId: string;
  status: string;
  timestamp: string;
}
