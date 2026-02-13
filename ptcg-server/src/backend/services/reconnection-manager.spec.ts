import { ReconnectionManager } from './reconnection-manager';
import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { User } from '../../storage/model/user';
import { GameStatePreserver } from './game-state-preserver';
import { SocketClient } from '../socket/socket-client';
import { Socket } from 'socket.io';
import { State, GamePhase } from '../../game/store/state/state';
import { Game } from '../../game/core/game';
import { ReconnectionConfig } from '../interfaces/reconnection.interface';
import { GameError } from '../../game/game-error';

describe('ReconnectionManager', () => {
  let reconnectionManager: ReconnectionManager;
  let mockConfig: ReconnectionConfig;
  let mockUser: User;
  let mockSocketClient: SocketClient;
  let mockSocket: Socket;
  let mockGame: Game;
  let mockState: State;
  let mockDisconnectedSession: DisconnectedSession;

  beforeEach(() => {
    // Setup mock config
    mockConfig = {
      preservationTimeoutMs: 300000, // 5 minutes
      maxAutoReconnectAttempts: 3,
      reconnectIntervals: [5000, 10000, 15000],
      healthCheckIntervalMs: 30000,
      cleanupIntervalMs: 60000,
      maxPreservedSessionsPerUser: 1,
      disconnectForfeitMs: 60 * 1000
    };

    // Setup mock GameStatePreserver methods
    spyOn(GameStatePreserver.prototype, 'preserveGameState').and.returnValue(Promise.resolve());
    spyOn(GameStatePreserver.prototype, 'getPreservedState').and.returnValue(Promise.resolve(null));
    spyOn(GameStatePreserver.prototype, 'removePreservedState').and.returnValue(Promise.resolve());
    spyOn(GameStatePreserver.prototype, 'hasPreservedState').and.returnValue(Promise.resolve(false));
    spyOn(GameStatePreserver.prototype, 'cleanupExpiredSessions').and.returnValue(Promise.resolve(0));
    spyOn(GameStatePreserver.prototype, 'getPreservedSessionsForUser').and.returnValue(Promise.resolve([]));

    // Setup mock User
    mockUser = {
      id: 1,
      name: 'testuser',
      email: 'test@example.com'
    } as any;

    // Setup mock State
    mockState = {
      phase: GamePhase.PLAYER_TURN,
      activePlayer: 0
    } as any;

    // Setup mock Game
    mockGame = {
      id: 123,
      state: mockState
    } as any;

    // Setup mock SocketClient
    mockSocketClient = {
      user: mockUser,
      games: [mockGame]
    } as any;

    // Setup mock Socket
    mockSocket = {} as any;

    // Setup mock DisconnectedSession
    mockDisconnectedSession = new DisconnectedSession();
    mockDisconnectedSession.id = 1;
    mockDisconnectedSession.userId = 1;
    mockDisconnectedSession.gameId = 123;
    mockDisconnectedSession.gameState = '';
    mockDisconnectedSession.disconnectedAt = Date.now();
    mockDisconnectedSession.expiresAt = Date.now() + 300000;
    mockDisconnectedSession.gamePhase = 'PLAY';
    mockDisconnectedSession.isPlayerTurn = false;
    mockDisconnectedSession.disconnectionReason = 'network';

    spyOn(mockDisconnectedSession, 'save').and.returnValue(Promise.resolve());
    spyOn(mockDisconnectedSession, 'remove').and.returnValue(Promise.resolve());

    // Mock DisconnectedSession static methods
    spyOn(DisconnectedSession, 'findOne').and.returnValue(Promise.resolve(null));
    spyOn(DisconnectedSession, 'find').and.returnValue(Promise.resolve([]));
    spyOn(DisconnectedSession.prototype, 'save').and.returnValue(Promise.resolve());
    spyOn(DisconnectedSession.prototype, 'remove').and.returnValue(Promise.resolve());

    // Create ReconnectionManager instance
    reconnectionManager = new ReconnectionManager(mockConfig);
  });

  afterEach(() => {
    reconnectionManager.dispose();
  });

  describe('constructor', () => {
    it('should create ReconnectionManager with correct config', () => {
      expect(reconnectionManager).toBeDefined();
    });

    it('should start cleanup interval', () => {
      spyOn(global, 'setInterval').and.returnValue({} as any);
      const manager = new ReconnectionManager(mockConfig);
      expect(setInterval).toHaveBeenCalledWith(
        jasmine.any(Function),
        mockConfig.cleanupIntervalMs
      );
      manager.dispose();
    });
  });

  describe('handleDisconnection', () => {
    it('should handle disconnection for user with active game', async () => {
      await reconnectionManager.handleDisconnection(mockSocketClient, 'network');

      expect(GameStatePreserver.prototype.preserveGameState).toHaveBeenCalledWith(
        mockGame.id,
        mockUser.id,
        mockState
      );
    });

    it('should not handle disconnection for user without active game', async () => {
      mockSocketClient.games = [];

      await reconnectionManager.handleDisconnection(mockSocketClient, 'network');

      expect(GameStatePreserver.prototype.preserveGameState).not.toHaveBeenCalled();
    });

    it('should handle disconnection when game is finished', async () => {
      mockGame.state.phase = GamePhase.FINISHED;

      await reconnectionManager.handleDisconnection(mockSocketClient, 'network');

      expect(GameStatePreserver.prototype.preserveGameState).not.toHaveBeenCalled();
    });

    it('should throw error when preservation fails', async () => {
      (GameStatePreserver.prototype.preserveGameState as jasmine.Spy).and.returnValue(
        Promise.reject(new Error('Preservation failed'))
      );

      try {
        await reconnectionManager.handleDisconnection(mockSocketClient, 'network');
        fail('Expected GameError to be thrown');
      } catch (error) {
        expect(error instanceof GameError).toBe(true);
        expect(error.message).toContain('Failed to handle disconnection for user 1');
      }
    });
  });

  describe('handleReconnection', () => {
    let createQueryBuilderSpy: jasmine.Spy;

    beforeEach(() => {
      // Mock the query builder for finding disconnected sessions
      createQueryBuilderSpy = spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          andWhere: jasmine.createSpy('andWhere').and.returnValue({
            orderBy: jasmine.createSpy('orderBy').and.returnValue({
              getOne: jasmine.createSpy('getOne').and.returnValue(Promise.resolve(mockDisconnectedSession))
            })
          })
        })
      } as any);
    });

    it('should successfully reconnect user with valid session', async () => {
      const mockPreservedState = {
        gameId: 123,
        userId: 1,
        state: mockState,
        preservedAt: Date.now(),
        lastActivity: Date.now()
      };

      (GameStatePreserver.prototype.getPreservedState as jasmine.Spy).and.returnValue(
        Promise.resolve(mockPreservedState)
      );

      const result = await reconnectionManager.handleReconnection(mockUser, mockSocket);

      expect(result.success).toBe(true);
      expect(result.gameId).toBe(123);
      expect(result.gameState).toBe(mockState);
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
      expect(GameStatePreserver.prototype.removePreservedState).toHaveBeenCalledWith(123, 1);
    });

    it('should fail reconnection when no active session found', async () => {
      createQueryBuilderSpy.and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          andWhere: jasmine.createSpy('andWhere').and.returnValue({
            orderBy: jasmine.createSpy('orderBy').and.returnValue({
              getOne: jasmine.createSpy('getOne').and.returnValue(Promise.resolve(null))
            })
          })
        })
      } as any);

      const result = await reconnectionManager.handleReconnection(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No active disconnected session found');
    });

    it('should fail reconnection when session has expired', async () => {
      mockDisconnectedSession.expiresAt = Date.now() - 1000; // Expired

      const result = await reconnectionManager.handleReconnection(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Reconnection session has expired');
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
    });

    it('should fail reconnection when preserved state not found', async () => {
      (GameStatePreserver.prototype.getPreservedState as jasmine.Spy).and.returnValue(
        Promise.resolve(null)
      );

      const result = await reconnectionManager.handleReconnection(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Game state could not be restored');
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
    });

    it('should handle errors during reconnection', async () => {
      (GameStatePreserver.prototype.getPreservedState as jasmine.Spy).and.returnValue(
        Promise.reject(new Error('Database error'))
      );

      const result = await reconnectionManager.handleReconnection(mockUser, mockSocket);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Reconnection failed');
    });
  });

  describe('getReconnectionStatus', () => {
    let statusQueryBuilderSpy: jasmine.Spy;

    beforeEach(() => {
      statusQueryBuilderSpy = jasmine.createSpy('createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          andWhere: jasmine.createSpy('andWhere').and.returnValue({
            orderBy: jasmine.createSpy('orderBy').and.returnValue({
              getOne: jasmine.createSpy('getOne').and.returnValue(Promise.resolve(mockDisconnectedSession))
            })
          })
        })
      } as any);
      (DisconnectedSession as any).createQueryBuilder = statusQueryBuilderSpy;
    });

    it('should return reconnection status for active session', async () => {
      const status = await reconnectionManager.getReconnectionStatus(1);

      expect(status).toEqual({
        userId: mockDisconnectedSession.userId,
        gameId: mockDisconnectedSession.gameId,
        disconnectedAt: mockDisconnectedSession.disconnectedAt,
        expiresAt: mockDisconnectedSession.expiresAt,
        gamePhase: mockDisconnectedSession.gamePhase,
        isPlayerTurn: mockDisconnectedSession.isPlayerTurn
      });
    });

    it('should return null when no active session found', async () => {
      statusQueryBuilderSpy.and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          andWhere: jasmine.createSpy('andWhere').and.returnValue({
            orderBy: jasmine.createSpy('orderBy').and.returnValue({
              getOne: jasmine.createSpy('getOne').and.returnValue(Promise.resolve(null))
            })
          })
        })
      } as any);

      const status = await reconnectionManager.getReconnectionStatus(1);

      expect(status).toBeNull();
    });

    it('should return null and cleanup expired session', async () => {
      mockDisconnectedSession.expiresAt = Date.now() - 1000; // Expired

      const status = await reconnectionManager.getReconnectionStatus(1);

      expect(status).toBeNull();
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      statusQueryBuilderSpy.and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          andWhere: jasmine.createSpy('andWhere').and.returnValue({
            orderBy: jasmine.createSpy('orderBy').and.returnValue({
              getOne: jasmine.createSpy('getOne').and.returnValue(Promise.reject(new Error('Database error')))
            })
          })
        })
      } as any);

      const status = await reconnectionManager.getReconnectionStatus(1);

      expect(status).toBeNull();
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should cleanup expired sessions', async () => {
      const expiredSessions = [mockDisconnectedSession];
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve(expiredSessions))
        })
      } as any);

      await reconnectionManager.cleanupExpiredSessions();

      expect(GameStatePreserver.prototype.removePreservedState).toHaveBeenCalledWith(
        mockDisconnectedSession.gameId,
        mockDisconnectedSession.userId
      );
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
      expect(GameStatePreserver.prototype.cleanupExpiredSessions).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.reject(new Error('Database error')))
        })
      } as any);

      // Should not throw
      await reconnectionManager.cleanupExpiredSessions();
      expect(true).toBe(true); // Test passes if no error is thrown
    });
  });

  describe('getActiveDisconnectedSessions', () => {
    it('should return active disconnected sessions', async () => {
      const activeSessions = [mockDisconnectedSession];
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve(activeSessions))
        })
      } as any);

      const result = await reconnectionManager.getActiveDisconnectedSessions();

      expect(result).toEqual(activeSessions);
    });

    it('should handle errors and return empty array', async () => {
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue({
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.reject(new Error('Database error')))
        })
      } as any);

      const result = await reconnectionManager.getActiveDisconnectedSessions();

      expect(result).toEqual([]);
    });
  });

  describe('cleanupUserSessions', () => {
    it('should cleanup all sessions for a user', async () => {
      const userSessions = [mockDisconnectedSession];
      (DisconnectedSession.find as jasmine.Spy).and.returnValue(Promise.resolve(userSessions));

      await reconnectionManager.cleanupUserSessions(1);

      expect(GameStatePreserver.prototype.removePreservedState).toHaveBeenCalledWith(
        mockDisconnectedSession.gameId,
        mockDisconnectedSession.userId
      );
      expect(mockDisconnectedSession.remove).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      (DisconnectedSession.find as jasmine.Spy).and.returnValue(Promise.reject(new Error('Database error')));

      // Should not throw
      await reconnectionManager.cleanupUserSessions(1);
      expect(true).toBe(true); // Test passes if no error is thrown
    });
  });

  describe('dispose', () => {
    it('should clear cleanup interval', () => {
      spyOn(global, 'clearInterval');

      reconnectionManager.dispose();

      expect(clearInterval).toHaveBeenCalled();
    });
  });
});