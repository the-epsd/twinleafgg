import { ReconnectionConflictResolver } from './reconnection-conflict-resolver';
import { State, GamePhase, GameWinner } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';

describe('ReconnectionConflictResolver', () => {
  let resolver: ReconnectionConflictResolver;
  let mockServerState: State;
  let mockPreservedState: State;

  beforeEach(() => {
    resolver = new ReconnectionConflictResolver();
    
    mockServerState = new State();
    mockServerState.phase = GamePhase.PLAYER_TURN;
    mockServerState.activePlayer = 0;
    mockServerState.winner = GameWinner.NONE;
    mockServerState.turn = 1;
    mockServerState.players = [new Player(), new Player()];

    mockPreservedState = new State();
    mockPreservedState.phase = GamePhase.PLAYER_TURN;
    mockPreservedState.activePlayer = 0;
    mockPreservedState.winner = GameWinner.NONE;
    mockPreservedState.turn = 1;
    mockPreservedState.players = [new Player(), new Player()];
  });

  describe('detectConflicts', () => {
    it('should detect no conflicts when states are identical', () => {
      const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
      expect(conflicts.length).toBe(0);
    });

    it('should detect phase mismatch conflicts', () => {
      mockPreservedState.phase = GamePhase.FINISHED;
      const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
      expect(conflicts.length).toBe(1);
      expect(conflicts[0].type).toBe('phase_mismatch');
    });

    it('should detect turn mismatch conflicts', () => {
      mockPreservedState.activePlayer = 1;
      const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
      expect(conflicts.length).toBe(1);
      expect(conflicts[0].type).toBe('turn_mismatch');
    });
  });

  describe('validateState', () => {
    it('should validate a correct state', () => {
      const result = resolver.validateState(mockServerState, 1, 1);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect null state', () => {
      const result = resolver.validateState(null as any, 1, 1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('State is null or undefined');
    });
  });
});