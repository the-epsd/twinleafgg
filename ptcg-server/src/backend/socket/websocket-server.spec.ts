import { WebSocketServer } from './websocket-server';
import { Core } from '../../game/core/core';
import { User } from '../../storage';
import { Socket } from 'socket.io';
import { ReconnectionManager } from '../services/reconnection-manager';

describe('WebSocketServer', () => {
  let webSocketServer: WebSocketServer;
  let mockCore: jasmine.SpyObj<Core>;
  let mockSocket: jasmine.SpyObj<Socket>;
  let mockUser: User;

  beforeEach(() => {
    mockCore = jasmine.createSpyObj('Core', ['connect', 'disconnect', 'games']);
    mockCore.games = [];

    webSocketServer = new WebSocketServer(mockCore);

    mockSocket = jasmine.createSpyObj('Socket', ['emit', 'disconnect']);
    (mockSocket as any).handshake = {
      query: {},
      headers: {}
    };

    mockUser = new User();
    mockUser.id = 1;
    mockUser.name = 'TestUser';
  });

  afterEach(() => {
    webSocketServer.dispose();
  });

  describe('constructor', () => {
    it('should create ReconnectionManager with config', () => {
      expect(webSocketServer.getReconnectionManager()).toBeDefined();
      expect(webSocketServer.getReconnectionManager().constructor.name).toBe('ReconnectionManager');
    });
  });

  describe('validateUserSessionForReconnection', () => {
    it('should return true for valid session', () => {
      const reconnectionStatus = {
        userId: 1,
        gameId: 123,
        disconnectedAt: Date.now() - 60000, // 1 minute ago
        expiresAt: Date.now() + 240000, // 4 minutes from now
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      const result = (webSocketServer as any).validateUserSessionForReconnection(mockUser, reconnectionStatus);
      expect(result).toBe(true);
    });

    it('should return false for expired session', () => {
      const reconnectionStatus = {
        userId: 1,
        gameId: 123,
        disconnectedAt: Date.now() - 360000, // 6 minutes ago
        expiresAt: Date.now() - 60000, // expired 1 minute ago
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      const result = (webSocketServer as any).validateUserSessionForReconnection(mockUser, reconnectionStatus);
      expect(result).toBe(false);
    });

    it('should return false for mismatched user ID', () => {
      const reconnectionStatus = {
        userId: 999, // different user ID
        gameId: 123,
        disconnectedAt: Date.now() - 60000,
        expiresAt: Date.now() + 240000,
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      const result = (webSocketServer as any).validateUserSessionForReconnection(mockUser, reconnectionStatus);
      expect(result).toBe(false);
    });

    it('should return false for null user', () => {
      const reconnectionStatus = {
        userId: 1,
        gameId: 123,
        disconnectedAt: Date.now() - 60000,
        expiresAt: Date.now() + 240000,
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      const result = (webSocketServer as any).validateUserSessionForReconnection(null, reconnectionStatus);
      expect(result).toBe(false);
    });

    it('should return false for null reconnection status', () => {
      const result = (webSocketServer as any).validateUserSessionForReconnection(mockUser, null);
      expect(result).toBe(false);
    });
  });

  describe('handleReconnectionAttempt', () => {
    let mockReconnectionManager: jasmine.SpyObj<ReconnectionManager>;

    beforeEach(() => {
      mockReconnectionManager = jasmine.createSpyObj('ReconnectionManager', [
        'getReconnectionStatus',
        'handleReconnection',
        'dispose'
      ]);
      (webSocketServer as any).reconnectionManager = mockReconnectionManager;
    });

    it('should return success false for normal connection', async () => {
      mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(null));

      const result = await (webSocketServer as any).handleReconnectionAttempt(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(mockReconnectionManager.getReconnectionStatus).toHaveBeenCalledWith(1);
    });

    it('should handle reconnection attempt when marked as such', async () => {
      (mockSocket as any).isReconnectionAttempt = true;
      mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(null));

      const result = await (webSocketServer as any).handleReconnectionAttempt(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No active disconnected session found');
      expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:failed', jasmine.any(Object));
    });

    it('should attempt reconnection when valid session exists', async () => {
      const mockReconnectionStatus = {
        userId: 1,
        gameId: 123,
        disconnectedAt: Date.now() - 60000,
        expiresAt: Date.now() + 240000,
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(mockReconnectionStatus));
      mockReconnectionManager.handleReconnection.and.returnValue(Promise.resolve({
        success: true,
        gameId: 123,
        gameState: { phase: 'SETUP' }
      }));

      const result = await (webSocketServer as any).handleReconnectionAttempt(mockUser, mockSocket);

      expect(result.success).toBe(true);
      expect(result.gameId).toBe(123);
      expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:success', jasmine.any(Object));
    });

    it('should handle reconnection failure', async () => {
      const mockReconnectionStatus = {
        userId: 1,
        gameId: 123,
        disconnectedAt: Date.now() - 60000,
        expiresAt: Date.now() + 240000,
        gamePhase: 'SETUP',
        isPlayerTurn: false
      };

      mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(mockReconnectionStatus));
      mockReconnectionManager.handleReconnection.and.returnValue(Promise.resolve({
        success: false,
        error: 'Game state could not be restored'
      }));

      const result = await (webSocketServer as any).handleReconnectionAttempt(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Game state could not be restored');
      expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:failed', jasmine.any(Object));
    });
  });

  describe('dispose', () => {
    it('should dispose reconnection manager and close server', () => {
      const mockReconnectionManager = jasmine.createSpyObj('ReconnectionManager', ['dispose']);
      const mockServer = jasmine.createSpyObj('Server', ['close']);

      (webSocketServer as any).reconnectionManager = mockReconnectionManager;
      webSocketServer.server = mockServer;

      webSocketServer.dispose();

      expect(mockReconnectionManager.dispose).toHaveBeenCalled();
      expect(mockServer.close).toHaveBeenCalled();
    });
  });
});