export interface GatewayRequest {
  provider: string;
  prompt: string;
}

export interface GatewayResponse {
  success: boolean;
  provider: string;
  data: {
    text: string;
  };
  timestamp: string;
}