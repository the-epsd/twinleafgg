import { GameStatePreserver, GameStatePreserverConfig } from './game-state-preserver';
import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { State, GamePhase, GameWinner } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { GameError } from '../../game/game-error';

describe('GameStatePreserver', () => {
  let gameStatePreserver: GameStatePreserver;
  let mockConfig: GameStatePreserverConfig;
  let mockState: State;

  beforeEach(() => {
    mockConfig = {
      preservationTimeoutMs: 300000, // 5 minutes
      maxPreservedSessionsPerUser: 1
    };

    gameStatePreserver = new GameStatePreserver(mockConfig);

    // Create a mock state
    mockState = new State();
    mockState.phase = GamePhase.PLAYER_TURN;
    mockState.turn = 1;
    mockState.activePlayer = 0;
    mockState.winner = GameWinner.NONE;
    mockState.players = [new Player(), new Player()];

    // Mock DisconnectedSession static methods
    spyOn(DisconnectedSession, 'findOne').and.returnValue(Promise.resolve(null));
    spyOn(DisconnectedSession, 'find').and.returnValue(Promise.resolve([]));
    spyOn(DisconnectedSession.prototype, 'save').and.returnValue(Promise.resolve());
    spyOn(DisconnectedSession.prototype, 'remove').and.returnValue(Promise.resolve());
  });

  describe('preserveGameState', () => {
    it('should create a new disconnected session when none exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      // when
      await gameStatePreserver.preserveGameState(gameId, userId, mockState);

      // then
      expect(DisconnectedSession.findOne).toHaveBeenCalledWith({
        where: { userId, gameId }
      });
      expect(DisconnectedSession.prototype.save).toHaveBeenCalled();
    });

    it('should update existing disconnected session when one exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const existingSession = new DisconnectedSession();
      existingSession.id = 1;
      existingSession.userId = userId;
      existingSession.gameId = gameId;

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(existingSession));

      // when
      await gameStatePreserver.preserveGameState(gameId, userId, mockState);

      // then
      expect(DisconnectedSession.findOne).toHaveBeenCalledWith({
        where: { userId, gameId }
      });
      expect(existingSession.save).toHaveBeenCalled();
    });

    it('should set correct expiration time', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const startTime = Date.now();

      // when
      await gameStatePreserver.preserveGameState(gameId, userId, mockState);

      // then
      const savedSession = (DisconnectedSession.prototype.save as jasmine.Spy).calls.mostRecent().object;
      expect(savedSession.expiresAt).toBeGreaterThanOrEqual(startTime + mockConfig.preservationTimeoutMs);
    });

    it('should set game phase and player turn correctly', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      mockState.phase = GamePhase.ATTACK;
      mockState.activePlayer = 1;

      // when
      await gameStatePreserver.preserveGameState(gameId, userId, mockState);

      // then
      const savedSession = (DisconnectedSession.prototype.save as jasmine.Spy).calls.mostRecent().object;
      expect(savedSession.gamePhase).toBe(GamePhase.ATTACK.toString());
      expect(savedSession.isPlayerTurn).toBe(false); // Since getPlayerIndex returns 0 and activePlayer is 1
    });

    it('should enforce session limits per user', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const oldSession = new DisconnectedSession();
      oldSession.disconnectedAt = Date.now() - 1000;

      (DisconnectedSession.find as jasmine.Spy).and.returnValue(Promise.resolve([oldSession]));

      // when
      await gameStatePreserver.preserveGameState(gameId, userId, mockState);

      // then
      expect(oldSession.remove).toHaveBeenCalled();
    });

    it('should throw GameError when serialization fails', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const invalidState = null as any;

      // when & then
      try {
        await gameStatePreserver.preserveGameState(gameId, userId, invalidState);
        fail('Expected GameError to be thrown');
      } catch (error) {
        expect(error instanceof GameError).toBe(true);
      }
    });
  });

  describe('getPreservedState', () => {
    it('should return null when no session exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      // when
      const result = await gameStatePreserver.getPreservedState(gameId, userId);

      // then
      expect(result).toBeNull();
      expect(DisconnectedSession.findOne).toHaveBeenCalledWith({
        where: { userId, gameId }
      });
    });

    it('should return null and cleanup when session is expired', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const expiredSession = new DisconnectedSession();
      expiredSession.expiresAt = Date.now() - 1000; // Expired 1 second ago

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(expiredSession));

      // when
      const result = await gameStatePreserver.getPreservedState(gameId, userId);

      // then
      expect(result).toBeNull();
      expect(expiredSession.remove).toHaveBeenCalled();
    });

    it('should return preserved state when session is valid', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const validSession = new DisconnectedSession();
      validSession.gameId = gameId;
      validSession.userId = userId;
      validSession.expiresAt = Date.now() + 300000; // Expires in 5 minutes
      validSession.disconnectedAt = Date.now() - 1000;

      // Mock serialized state
      const serializedState = JSON.stringify({
        phase: GamePhase.PLAYER_TURN,
        players: [],
        turn: 1
      });
      validSession.gameState = serializedState;

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(validSession));

      // Mock the deserializer to return our mock state
      spyOn(gameStatePreserver as any, 'deserializeState').and.returnValue(mockState);

      // when
      const result = await gameStatePreserver.getPreservedState(gameId, userId);

      // then
      expect(result).not.toBeNull();
      expect(result!.gameId).toBe(gameId);
      expect(result!.userId).toBe(userId);
      expect(result!.state).toBe(mockState);
    });

    it('should throw GameError when deserialization fails', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const validSession = new DisconnectedSession();
      validSession.gameId = gameId;
      validSession.userId = userId;
      validSession.expiresAt = Date.now() + 300000;
      validSession.gameState = 'invalid-json';

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(validSession));

      // when & then
      try {
        await gameStatePreserver.getPreservedState(gameId, userId);
        fail('Expected GameError to be thrown');
      } catch (error) {
        expect(error instanceof GameError).toBe(true);
      }
    });
  });

  describe('removePreservedState', () => {
    it('should remove session when it exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const session = new DisconnectedSession();

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(session));

      // when
      await gameStatePreserver.removePreservedState(gameId, userId);

      // then
      expect(DisconnectedSession.findOne).toHaveBeenCalledWith({
        where: { userId, gameId }
      });
      expect(session.remove).toHaveBeenCalled();
    });

    it('should handle gracefully when no session exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      // when
      await gameStatePreserver.removePreservedState(gameId, userId);

      // then
      expect(DisconnectedSession.findOne).toHaveBeenCalledWith({
        where: { userId, gameId }
      });
      // Should not throw any error
    });

    it('should throw GameError when removal fails', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const session = new DisconnectedSession();

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(session));
      (session.remove as jasmine.Spy).and.returnValue(Promise.reject(new Error('Database error')));

      // when & then
      try {
        await gameStatePreserver.removePreservedState(gameId, userId);
        fail('Expected GameError to be thrown');
      } catch (error) {
        expect(error instanceof GameError).toBe(true);
      }
    });
  });

  describe('hasPreservedState', () => {
    it('should return false when no session exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      // when
      const result = await gameStatePreserver.hasPreservedState(gameId, userId);

      // then
      expect(result).toBe(false);
    });

    it('should return false and cleanup when session is expired', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const expiredSession = new DisconnectedSession();
      expiredSession.expiresAt = Date.now() - 1000;

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(expiredSession));

      // when
      const result = await gameStatePreserver.hasPreservedState(gameId, userId);

      // then
      expect(result).toBe(false);
      expect(expiredSession.remove).toHaveBeenCalled();
    });

    it('should return true when valid session exists', async () => {
      // given
      const gameId = 123;
      const userId = 456;
      const validSession = new DisconnectedSession();
      validSession.expiresAt = Date.now() + 300000;

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.resolve(validSession));

      // when
      const result = await gameStatePreserver.hasPreservedState(gameId, userId);

      // then
      expect(result).toBe(true);
    });

    it('should return false when database error occurs', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      (DisconnectedSession.findOne as jasmine.Spy).and.returnValue(Promise.reject(new Error('Database error')));

      // when
      const result = await gameStatePreserver.hasPreservedState(gameId, userId);

      // then
      expect(result).toBe(false);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should remove expired sessions and return count', async () => {
      // given
      const expiredSession1 = new DisconnectedSession();
      const expiredSession2 = new DisconnectedSession();
      const expiredSessions = [expiredSession1, expiredSession2];

      // Mock the query builder chain
      const mockQueryBuilder = {
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve(expiredSessions))
        })
      };
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder as any);

      // when
      const result = await gameStatePreserver.cleanupExpiredSessions();

      // then
      expect(result).toBe(2);
      expect(expiredSession1.remove).toHaveBeenCalled();
      expect(expiredSession2.remove).toHaveBeenCalled();
    });

    it('should return 0 when no expired sessions exist', async () => {
      // given
      const mockQueryBuilder = {
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.resolve([]))
        })
      };
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder as any);

      // when
      const result = await gameStatePreserver.cleanupExpiredSessions();

      // then
      expect(result).toBe(0);
    });

    it('should return 0 when database error occurs', async () => {
      // given
      const mockQueryBuilder = {
        where: jasmine.createSpy('where').and.returnValue({
          getMany: jasmine.createSpy('getMany').and.returnValue(Promise.reject(new Error('Database error')))
        })
      };
      spyOn(DisconnectedSession, 'createQueryBuilder').and.returnValue(mockQueryBuilder as any);

      // when
      const result = await gameStatePreserver.cleanupExpiredSessions();

      // then
      expect(result).toBe(0);
    });
  });

  describe('getPreservedSessionsForUser', () => {
    it('should return sessions for user', async () => {
      // given
      const userId = 456;
      const session1 = new DisconnectedSession();
      const session2 = new DisconnectedSession();
      const sessions = [session1, session2];

      (DisconnectedSession.find as jasmine.Spy).and.returnValue(Promise.resolve(sessions));

      // when
      const result = await gameStatePreserver.getPreservedSessionsForUser(userId);

      // then
      expect(result).toBe(sessions);
      expect(DisconnectedSession.find).toHaveBeenCalledWith({
        where: { userId }
      });
    });

    it('should return empty array when database error occurs', async () => {
      // given
      const userId = 456;

      (DisconnectedSession.find as jasmine.Spy).and.returnValue(Promise.reject(new Error('Database error')));

      // when
      const result = await gameStatePreserver.getPreservedSessionsForUser(userId);

      // then
      expect(result).toEqual([]);
    });
  });

  describe('serialization error handling', () => {
    it('should handle serialization errors gracefully', async () => {
      // given
      const gameId = 123;
      const userId = 456;

      // Mock the serializer to throw an error
      spyOn(gameStatePreserver as any, 'serializeState').and.throwError('Serialization failed');

      // when & then
      try {
        await gameStatePreserver.preserveGameState(gameId, userId, mockState);
        fail('Expected GameError to be thrown');
      } catch (error) {
        expect(error instanceof GameError).toBe(true);
      }
    });
  });

  describe('configuration', () => {
    it('should use provided configuration values', () => {
      // given
      const customConfig: GameStatePreserverConfig = {
        preservationTimeoutMs: 600000, // 10 minutes
        maxPreservedSessionsPerUser: 3
      };

      // when
      const customPreserver = new GameStatePreserver(customConfig);

      // then
      expect((customPreserver as any).config).toEqual(customConfig);
    });
  });
});