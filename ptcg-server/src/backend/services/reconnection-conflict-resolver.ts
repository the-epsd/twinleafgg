import { State, GamePhase } from '../../game/store/state/state';
import { CardList } from '../../game/store/state/card-list';
import { logger, LogLevel } from '../../utils/logger';

export interface StateConflict {
  type: 'phase_mismatch' | 'turn_mismatch' | 'player_count_mismatch' | 'data_corruption' | 'version_mismatch';
  description: string;
  serverState: any;
  preservedState: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolvable: boolean;
}

export interface ConflictResolutionResult {
  success: boolean;
  resolvedState?: State;
  conflicts: StateConflict[];
  fallbackApplied: boolean;
  error?: string;
}

export interface StateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canRecover: boolean;
}

export class ReconnectionConflictResolver {

  /**
   * Detect conflicts between server state and preserved state
   */
  public detectConflicts(serverState: State, preservedState: State, gameId: number, userId: number): StateConflict[] {
    const sessionId = `conflict-detection-${userId}-${gameId}-${Date.now()}`;
    const conflicts: StateConflict[] = [];

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'conflict-resolution',
        message: 'Starting conflict detection',
        userId,
        gameId,
        sessionId,
        data: {
          serverPhase: serverState.phase.toString(),
          preservedPhase: preservedState.phase.toString()
        }
      });

      // Check for phase mismatches
      if (serverState.phase !== preservedState.phase) {
        conflicts.push({
          type: 'phase_mismatch',
          description: `Game phase mismatch: server=${serverState.phase}, preserved=${preservedState.phase}`,
          serverState: { phase: serverState.phase },
          preservedState: { phase: preservedState.phase },
          severity: this.getPhaseConflictSeverity(serverState.phase, preservedState.phase),
          resolvable: this.isPhaseConflictResolvable(serverState.phase, preservedState.phase)
        });
      }

      // Check for turn mismatches
      if (serverState.activePlayer !== preservedState.activePlayer) {
        conflicts.push({
          type: 'turn_mismatch',
          description: `Active player mismatch: server=${serverState.activePlayer}, preserved=${preservedState.activePlayer}`,
          serverState: { activePlayer: serverState.activePlayer },
          preservedState: { activePlayer: preservedState.activePlayer },
          severity: 'medium',
          resolvable: true
        });
      }

      // Check for player count mismatches
      if (serverState.players.length !== preservedState.players.length) {
        conflicts.push({
          type: 'player_count_mismatch',
          description: `Player count mismatch: server=${serverState.players.length}, preserved=${preservedState.players.length}`,
          serverState: { playerCount: serverState.players.length },
          preservedState: { playerCount: preservedState.players.length },
          severity: 'high',
          resolvable: false
        });
      }

      // Check for data corruption indicators
      const corruptionCheck = this.checkForDataCorruption(serverState, preservedState);
      if (corruptionCheck.isCorrupted) {
        conflicts.push({
          type: 'data_corruption',
          description: corruptionCheck.description,
          serverState: corruptionCheck.serverData,
          preservedState: corruptionCheck.preservedData,
          severity: 'critical',
          resolvable: corruptionCheck.canRecover
        });
      }

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'conflict-resolution',
        message: 'Conflict detection completed',
        userId,
        gameId,
        sessionId,
        data: {
          conflictCount: conflicts.length,
          conflictTypes: conflicts.map(c => c.type),
          resolvableConflicts: conflicts.filter(c => c.resolvable).length
        }
      });

      return conflicts;

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'conflict-resolution',
        message: 'Error during conflict detection',
        userId,
        gameId,
        sessionId,
        error: error as Error
      });

      // Return a critical conflict indicating detection failure
      return [{
        type: 'data_corruption',
        description: `Conflict detection failed: ${error}`,
        serverState: {},
        preservedState: {},
        severity: 'critical',
        resolvable: false
      }];
    }
  }

  /**
   * Resolve conflicts between states
   */
  public resolveConflicts(
    serverState: State,
    preservedState: State,
    conflicts: StateConflict[],
    gameId: number,
    userId: number
  ): ConflictResolutionResult {
    const sessionId = `conflict-resolution-${userId}-${gameId}-${Date.now()}`;
    let resolvedState = { ...serverState }; // Start with server state as base
    let fallbackApplied = false;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'conflict-resolution',
        message: 'Starting conflict resolution',
        userId,
        gameId,
        sessionId,
        data: {
          conflictCount: conflicts.length,
          conflictTypes: conflicts.map(c => c.type)
        }
      });

      // Check if any conflicts are unresolvable
      const unresolvableConflicts = conflicts.filter(c => !c.resolvable);
      if (unresolvableConflicts.length > 0) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'conflict-resolution',
          message: 'Unresolvable conflicts detected, applying fallback',
          userId,
          gameId,
          sessionId,
          data: {
            unresolvableConflicts: unresolvableConflicts.map(c => c.type)
          }
        });

        return this.applyFallbackStrategy(serverState, preservedState, conflicts, gameId, userId);
      }

      // Check for critical conflicts
      const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
      if (criticalConflicts.length > 0) {
        logger.logStructured({
          level: LogLevel.ERROR,
          category: 'conflict-resolution',
          message: 'Critical conflicts detected, applying fallback',
          userId,
          gameId,
          sessionId,
          data: {
            criticalConflicts: criticalConflicts.map(c => c.type)
          }
        });

        return this.applyFallbackStrategy(serverState, preservedState, conflicts, gameId, userId);
      }

      // Resolve individual conflicts
      for (const conflict of conflicts) {
        switch (conflict.type) {
          case 'phase_mismatch':
            resolvedState = this.resolvePhaseConflict(resolvedState, preservedState, conflict);
            break;
          case 'turn_mismatch':
            resolvedState = this.resolveTurnConflict(resolvedState, preservedState, conflict);
            break;
          case 'version_mismatch':
            resolvedState = this.resolveVersionConflict(resolvedState, preservedState, conflict);
            break;
          default:
            logger.logStructured({
              level: LogLevel.WARN,
              category: 'conflict-resolution',
              message: 'Unknown conflict type, skipping resolution',
              userId,
              gameId,
              sessionId,
              data: { conflictType: conflict.type }
            });
        }
      }

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'conflict-resolution',
        message: 'Conflict resolution completed successfully',
        userId,
        gameId,
        sessionId,
        data: {
          resolvedConflicts: conflicts.length,
          fallbackApplied
        }
      });

      return {
        success: true,
        resolvedState,
        conflicts,
        fallbackApplied
      };

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'conflict-resolution',
        message: 'Error during conflict resolution',
        userId,
        gameId,
        sessionId,
        error: error as Error
      });

      // Apply fallback strategy on resolution error
      return this.applyFallbackStrategy(serverState, preservedState, conflicts, gameId, userId);
    }
  }

  /**
   * Validate state integrity before reconnection
   */
  public validateState(state: State, gameId: number, userId: number): StateValidationResult {
    const sessionId = `state-validation-${userId}-${gameId}-${Date.now()}`;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'state-validation',
        message: 'Starting state validation',
        userId,
        gameId,
        sessionId,
        data: { gamePhase: state.phase.toString() }
      });

      // Validate basic state structure
      if (!state) {
        errors.push('State is null or undefined');
        return { isValid: false, errors, warnings, canRecover: false };
      }

      // Validate game phase
      if (!this.isValidGamePhase(state.phase)) {
        errors.push(`Invalid game phase: ${state.phase}`);
      }

      // Validate players array
      if (!Array.isArray(state.players)) {
        errors.push('Players array is missing or invalid');
      } else if (state.players.length === 0) {
        errors.push('No players in game state');
      } else if (state.players.length > 2) {
        warnings.push(`Unusual player count: ${state.players.length}`);
      }

      // Validate active player
      if (state.activePlayer < 0 || state.activePlayer >= state.players.length) {
        errors.push(`Invalid active player index: ${state.activePlayer}`);
      }

      // Validate player states
      for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        if (!player) {
          errors.push(`Player ${i} is null or undefined`);
          continue;
        }

        // Validate deck
        if (!Array.isArray(player.deck)) {
          errors.push(`Player ${i} deck is missing or invalid`);
        }

        // Validate hand
        if (!Array.isArray(player.hand)) {
          errors.push(`Player ${i} hand is missing or invalid`);
        }

        // Validate discard pile
        if (!Array.isArray(player.discard)) {
          errors.push(`Player ${i} discard pile is missing or invalid`);
        }

        // Validate prize cards
        if (!Array.isArray(player.prizes)) {
          errors.push(`Player ${i} prize cards are missing or invalid`);
        }
      }

      // Check for data consistency
      const consistencyErrors = this.checkStateConsistency(state);
      errors.push(...consistencyErrors);

      const isValid = errors.length === 0;
      const canRecover = errors.length === 0 || this.canRecoverFromErrors(errors);

      logger.logStructured({
        level: isValid ? LogLevel.INFO : LogLevel.WARN,
        category: 'state-validation',
        message: 'State validation completed',
        userId,
        gameId,
        sessionId,
        data: {
          isValid,
          errorCount: errors.length,
          warningCount: warnings.length,
          canRecover
        }
      });

      return {
        isValid,
        errors,
        warnings,
        canRecover
      };

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-validation',
        message: 'Error during state validation',
        userId,
        gameId,
        sessionId,
        error: error as Error
      });

      return {
        isValid: false,
        errors: [`Validation failed: ${error}`],
        warnings,
        canRecover: false
      };
    }
  }

  /**
   * Attempt to recover from corrupted state
   */
  public recoverCorruptedState(
    corruptedState: State,
    fallbackState: State | null,
    gameId: number,
    userId: number
  ): ConflictResolutionResult {
    const sessionId = `state-recovery-${userId}-${gameId}-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'state-recovery',
        message: 'Attempting state recovery',
        userId,
        gameId,
        sessionId,
        data: {
          hasFallbackState: !!fallbackState,
          corruptedPhase: corruptedState?.phase?.toString() || 'unknown'
        }
      });

      // If we have a fallback state, validate it first
      if (fallbackState) {
        const fallbackValidation = this.validateState(fallbackState, gameId, userId);
        if (fallbackValidation.isValid) {
          logger.logStructured({
            level: LogLevel.INFO,
            category: 'state-recovery',
            message: 'Using valid fallback state',
            userId,
            gameId,
            sessionId
          });

          return {
            success: true,
            resolvedState: fallbackState,
            conflicts: [{
              type: 'data_corruption',
              description: 'Recovered using fallback state',
              serverState: {},
              preservedState: {},
              severity: 'high',
              resolvable: true
            }],
            fallbackApplied: true
          };
        }
      }

      // Attempt to repair the corrupted state
      const repairedState = this.attemptStateRepair(corruptedState, gameId, userId);
      if (repairedState) {
        const repairValidation = this.validateState(repairedState, gameId, userId);
        if (repairValidation.isValid || repairValidation.canRecover) {
          logger.logStructured({
            level: LogLevel.INFO,
            category: 'state-recovery',
            message: 'State repair successful',
            userId,
            gameId,
            sessionId
          });

          return {
            success: true,
            resolvedState: repairedState,
            conflicts: [{
              type: 'data_corruption',
              description: 'State repaired successfully',
              serverState: {},
              preservedState: {},
              severity: 'medium',
              resolvable: true
            }],
            fallbackApplied: true
          };
        }
      }

      // If all recovery attempts fail, return failure
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-recovery',
        message: 'State recovery failed',
        userId,
        gameId,
        sessionId
      });

      return {
        success: false,
        conflicts: [{
          type: 'data_corruption',
          description: 'State recovery failed - unrecoverable corruption',
          serverState: {},
          preservedState: {},
          severity: 'critical',
          resolvable: false
        }],
        fallbackApplied: false,
        error: 'State is unrecoverable due to critical corruption'
      };

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-recovery',
        message: 'Error during state recovery',
        userId,
        gameId,
        sessionId,
        error: error as Error
      });

      return {
        success: false,
        conflicts: [],
        fallbackApplied: false,
        error: `State recovery failed: ${error}`
      };
    }
  }

  /**
   * Apply fallback strategy when conflicts cannot be resolved
   */
  private applyFallbackStrategy(
    serverState: State,
    preservedState: State,
    conflicts: StateConflict[],
    gameId: number,
    userId: number
  ): ConflictResolutionResult {
    const sessionId = `fallback-strategy-${userId}-${gameId}-${Date.now()}`;

    logger.logStructured({
      level: LogLevel.WARN,
      category: 'conflict-resolution',
      message: 'Applying fallback strategy',
      userId,
      gameId,
      sessionId,
      data: {
        conflictCount: conflicts.length,
        strategy: 'prioritize_server_state'
      }
    });

    // Strategy: Always prioritize server state for unresolvable conflicts
    // This ensures game consistency at the cost of potentially losing some player progress
    return {
      success: true,
      resolvedState: serverState,
      conflicts,
      fallbackApplied: true
    };
  }

  /**
   * Resolve phase conflicts
   */
  private resolvePhaseConflict(serverState: State, preservedState: State, conflict: StateConflict): State {
    // For phase conflicts, we generally trust the server state
    // but we may need to adjust player-specific data based on the preserved state
    const resolvedState = { ...serverState };

    // If the preserved state shows the player was in their turn,
    // we might need to restore some turn-specific information
    if (conflict.preservedState.phase === GamePhase.PLAYER_TURN &&
      conflict.serverState.phase === GamePhase.PLAYER_TURN) {
      // Both states are in player turn, check if it's the same player's turn
      // This is handled by turn conflict resolution
    }

    return resolvedState;
  }

  /**
   * Resolve turn conflicts
   */
  private resolveTurnConflict(serverState: State, preservedState: State, conflict: StateConflict): State {
    // For turn conflicts, prioritize server state but log the discrepancy
    const resolvedState = { ...serverState };

    // The server state is authoritative for whose turn it is
    // The client will be synchronized with the current game state

    return resolvedState;
  }

  /**
   * Resolve version conflicts
   */
  private resolveVersionConflict(serverState: State, preservedState: State, conflict: StateConflict): State {
    // For version conflicts, always use the server state
    // Version mismatches typically indicate the preserved state is outdated
    return { ...serverState };
  }

  /**
   * Check for data corruption indicators
   */
  private checkForDataCorruption(serverState: State, preservedState: State): {
    isCorrupted: boolean;
    description: string;
    serverData: any;
    preservedData: any;
    canRecover: boolean;
  } {
    try {
      // Check for null/undefined critical fields
      if (!serverState.players || !preservedState.players) {
        return {
          isCorrupted: true,
          description: 'Missing players array',
          serverData: { hasPlayers: !!serverState.players },
          preservedData: { hasPlayers: !!preservedState.players },
          canRecover: false
        };
      }

      // Check for invalid data types
      if (typeof serverState.activePlayer !== 'number' || typeof preservedState.activePlayer !== 'number') {
        return {
          isCorrupted: true,
          description: 'Invalid activePlayer data type',
          serverData: { activePlayerType: typeof serverState.activePlayer },
          preservedData: { activePlayerType: typeof preservedState.activePlayer },
          canRecover: true
        };
      }

      // Check for array corruption
      if (!Array.isArray(serverState.players) || !Array.isArray(preservedState.players)) {
        return {
          isCorrupted: true,
          description: 'Players is not an array',
          serverData: { playersIsArray: Array.isArray(serverState.players) },
          preservedData: { playersIsArray: Array.isArray(preservedState.players) },
          canRecover: false
        };
      }

      return {
        isCorrupted: false,
        description: 'No corruption detected',
        serverData: {},
        preservedData: {},
        canRecover: true
      };

    } catch (error) {
      return {
        isCorrupted: true,
        description: `Corruption check failed: ${error}`,
        serverData: {},
        preservedData: {},
        canRecover: false
      };
    }
  }

  /**
   * Get severity of phase conflict
   */
  private getPhaseConflictSeverity(serverPhase: GamePhase, preservedPhase: GamePhase): 'low' | 'medium' | 'high' | 'critical' {
    // If game is finished on server but not in preserved state, it's high severity
    if (serverPhase === GamePhase.FINISHED && preservedPhase !== GamePhase.FINISHED) {
      return 'high';
    }

    // If preserved state shows finished but server doesn't, it's critical
    if (preservedPhase === GamePhase.FINISHED && serverPhase !== GamePhase.FINISHED) {
      return 'critical';
    }

    // Other phase mismatches are generally medium severity
    return 'medium';
  }

  /**
   * Check if phase conflict is resolvable
   */
  private isPhaseConflictResolvable(serverPhase: GamePhase, preservedPhase: GamePhase): boolean {
    // Most phase conflicts are resolvable by using server state
    // Exception: if preserved state shows game finished but server doesn't
    if (preservedPhase === GamePhase.FINISHED && serverPhase !== GamePhase.FINISHED) {
      return false;
    }

    return true;
  }

  /**
   * Check if game phase is valid
   */
  private isValidGamePhase(phase: any): boolean {
    return Object.values(GamePhase).includes(phase);
  }

  /**
   * Check state consistency
   */
  private checkStateConsistency(state: State): string[] {
    const errors: string[] = [];

    try {
      // Check if active player index is valid
      if (state.activePlayer >= state.players.length) {
        errors.push(`Active player index ${state.activePlayer} exceeds player count ${state.players.length}`);
      }

      // Check if game phase is consistent with game state
      if (state.phase === GamePhase.FINISHED) {
        // In finished games, there should be a winner or it should be a draw
        // This is game-specific logic that would need to be implemented based on the game rules
      }

      // Check for negative values where they shouldn't exist
      for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        if (player && Array.isArray(player.prizes) && player.prizes.length < 0) {
          errors.push(`Player ${i} has negative prize count`);
        }
      }

    } catch (error) {
      errors.push(`Consistency check failed: ${error}`);
    }

    return errors;
  }

  /**
   * Check if errors are recoverable
   */
  private canRecoverFromErrors(errors: string[]): boolean {
    // Define which types of errors are recoverable
    const recoverableErrorPatterns = [
      /Invalid active player index/,
      /negative prize count/,
      /Unusual player count/
    ];

    const unrecoverableErrorPatterns = [
      /is null or undefined/,
      /is missing or invalid/,
      /No players in game state/
    ];

    // If any unrecoverable errors exist, return false
    const hasUnrecoverableErrors = errors.some(error =>
      unrecoverableErrorPatterns.some(pattern => pattern.test(error))
    );

    if (hasUnrecoverableErrors) {
      return false;
    }

    // If all errors match recoverable patterns, return true
    return errors.every(error =>
      recoverableErrorPatterns.some(pattern => pattern.test(error))
    );
  }

  /**
   * Attempt to repair corrupted state
   */
  private attemptStateRepair(corruptedState: State, gameId: number, userId: number): State | null {
    try {
      const repairedState = { ...corruptedState };

      // Repair active player index if it's out of bounds
      if (repairedState.activePlayer >= repairedState.players.length) {
        repairedState.activePlayer = 0;
      }
      if (repairedState.activePlayer < 0) {
        repairedState.activePlayer = 0;
      }

      // Repair missing arrays
      for (let i = 0; i < repairedState.players.length; i++) {
        const player = repairedState.players[i];
        if (player) {
          if (!player.deck || !(player.deck instanceof CardList)) {
            player.deck = new CardList();
          }
          if (!player.hand || !(player.hand instanceof CardList)) {
            player.hand = new CardList();
          }
          if (!player.discard || !(player.discard instanceof CardList)) {
            player.discard = new CardList();
          }
          if (!Array.isArray(player.prizes)) {
            player.prizes = [];
          }
        }
      }

      return repairedState;

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-recovery',
        message: 'State repair attempt failed',
        userId,
        gameId,
        data: { error: error instanceof Error ? error.message : String(error) }
      });
      return null;
    }
  }
}