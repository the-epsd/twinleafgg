export interface ReconnectionConfig {
    preservationTimeoutMs: number;
    maxAutoReconnectAttempts: number;
    reconnectIntervals: number[];
    healthCheckIntervalMs: number;
    cleanupIntervalMs: number;
    maxPreservedSessionsPerUser: number;
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
