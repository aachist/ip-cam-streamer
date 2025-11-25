export interface StreamConfig {
  url: string;
  intervalSeconds: number;
}

export enum ConnectionStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR',
}