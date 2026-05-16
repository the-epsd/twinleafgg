import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Client } from '../client/client.interface';
import { Core } from './core';
import { Action } from '../store/actions/action';
import { buildReplayActionPayload } from './replay-actions';
import { State, GamePhase, GameWinner } from '../store/state/state';
import { User, Match } from '../../storage';
import { Replay } from './replay';
import { ReplayPlayer } from './replay.interface';

interface PendingReplayAction {
  type: string;
  payload: any;
  turn: number;
  phase: GamePhase;
  activePlayer: number;
}

export class MatchRecorder {

  private finished: boolean = false;
  private client1: Client | undefined;
  private client2: Client | undefined;
  private replay: Replay;
  private pendingActions: PendingReplayAction[] = [];
  private transactionTimeout: NodeJS.Timeout | undefined;
  private readonly TRANSACTION_TIMEOUT_MS = 30000; // 30 seconds

  constructor(private core: Core) {
    this.replay = new Replay({ indexEnabled: false });
  }

  public onAction(action: Action, state: State): void {
    if (this.finished) {
      return;
    }

    this.pendingActions.push({
      type: action.type,
      payload: this.buildActionPayload(action),
      turn: state.turn,
      phase: state.phase,
      activePlayer: state.activePlayer
    });
  }

  public onStateChange(state: State) {
    if (this.finished) {
      return;
    }

    if (state.players.length >= 2) {
      this.updateClients(state);
    }

    if (state.phase !== GamePhase.WAITING_FOR_PLAYERS) {
      this.replay.appendState(state);
    }
    this.flushPendingActions();

    if (state.phase === GamePhase.FINISHED) {
      this.finished = true;
      if (state.winner !== GameWinner.NONE) {
        this.saveMatch(state);
      } else {
        this.cleanup();
      }
    }
  }

  @Transaction()
  private async saveMatch(state: State, @TransactionManager() manager?: EntityManager) {
    if (!this.client1 || !this.client2 || manager === undefined) {
      this.cleanup();
      return;
    }

    try {
      // Set transaction timeout
      this.transactionTimeout = setTimeout(() => {
        console.error('[MatchRecorder] Transaction timeout after', this.TRANSACTION_TIMEOUT_MS, 'ms');
        this.cleanup();
      }, this.TRANSACTION_TIMEOUT_MS);

      const match = new Match();
      match.player1 = this.client1.user;
      match.player2 = this.client2.user;
      match.winner = state.winner;
      match.created = Date.now();

      match.player1DeckName = `Deck ${match.player1.id}`;
      match.player2DeckName = `Deck ${match.player2.id}`;
      match.player1DeckId = state.players[0].deckId || null;
      match.player2DeckId = state.players[1].deckId || null;

      this.replay.setCreated(match.created);
      this.replay.setGameSettings(state.gameSettings);
      this.replay.player1 = this.buildReplayPlayer(match.player1);
      this.replay.player2 = this.buildReplayPlayer(match.player2);
      this.replay.winner = match.winner;
      match.replayData = this.replay.serialize();

      await manager.save(match);

    } catch (error) {
      console.error('[MatchRecorder] Error saving match:', error);
    } finally {
      if (this.transactionTimeout) {
        clearTimeout(this.transactionTimeout);
      }
      this.cleanup();
    }
  }

  public cleanup(): void {
    this.finished = true;
    this.client1 = undefined;
    this.client2 = undefined;
    this.pendingActions = [];
    if (this.transactionTimeout) {
      clearTimeout(this.transactionTimeout);
      this.transactionTimeout = undefined;
    }
    this.replay = new Replay({ indexEnabled: false });
  }

  private updateClients(state: State) {
    const player1Id = state.players[0].id;
    const player2Id = state.players[1].id;
    if (this.client1 === undefined) {
      this.client1 = this.findClient(player1Id);
    }
    if (this.client2 === undefined) {
      this.client2 = this.findClient(player2Id);
    }
  }

  private findClient(clientId: number): Client | undefined {
    return this.core.clients.find(c => c.id === clientId);
  }

  private buildReplayPlayer(player: User): ReplayPlayer {
    return { userId: player.id, name: player.name };
  }

  private flushPendingActions(): void {
    const stateIndex = this.replay.getStateCount() - 1;
    this.pendingActions.forEach(action => {
      this.replay.appendAction(action.type, action.payload, {
        turn: action.turn,
        phase: action.phase,
        activePlayer: action.activePlayer
      }, stateIndex);
    });
    this.pendingActions = [];
  }

  private buildActionPayload(action: Action): any {
    return buildReplayActionPayload(action);
  }

}
