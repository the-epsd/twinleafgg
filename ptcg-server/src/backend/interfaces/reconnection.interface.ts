export interface ReconnectionConfig {
  // How long to preserve game state (default: 5 minutes)
  preservationTimeoutMs: number;

  // Automatic reconnection attempts (default: 3)
  maxAutoReconnectAttempts: number;

  // Intervals between reconnection attempts (default: [5000, 10000, 15000])
  reconnectIntervals: number[];

  // Connection health check interval (default: 30 seconds)
  healthCheckIntervalMs: number;

  // Cleanup interval for expired sessions (default: 1 minute)
  cleanupIntervalMs: number;

  // Maximum number of preserved sessions per user (default: 1)
  maxPreservedSessionsPerUser: number;

  // Time before auto-forfeit when a player is disconnected (default: 60 seconds)
  disconnectForfeitMs: number;
}

export interface ReconnectionResult {
  success: boolean;
  gameId?: number;
  gameState?: any;
  error?: string;
}

export interface ReconnectionStatus {
  userId: number;
  gameId: number;
  disconnectedAt: number;
  expiresAt: number;
  gamePhase: string;
  isPlayerTurn: boolean;
}

export interface PreservedGameState {
  gameId: number;
  userId: number;
  state: any;
  preservedAt: number;
  lastActivity: number;
}

export interface ConnectionMetrics {
  clientId: number;
  lastPing: number;
  averageLatency: number;
  packetLoss: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unstable';
}