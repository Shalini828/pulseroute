export interface GatewayRequest {
  provider: string;
  prompt: string;
  projectId: string;
}

export interface GatewayResponse {
  success: boolean;
  provider: string;
  data: {
    text: string;
  };
  timestamp: string;
}