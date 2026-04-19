import type { GameState, PlayerStats, Replay, State, StateLog } from 'ptcg-server';
import type { PlayerGameStats } from '../end-game/playerGameStats';

/** Mirrors Angular `LocalGameState` in session.interface.ts */
export interface LocalGameState extends Omit<GameState, 'playerStats'> {
  localId: number;
  deleted: boolean;
  gameOver: boolean;
  switchSide: boolean;
  promptMinimized: boolean;
  state: State;
  logs: StateLog[];
  replayPosition: number;
  replay?: Replay;
  playerStats?: PlayerStats[];
  enhancedPlayerStats?: PlayerGameStats[];
}
