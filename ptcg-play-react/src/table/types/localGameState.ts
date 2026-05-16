import type { GameState, PlayerStats, Replay, State, StateLog } from 'ptcg-server';
import type { PlayerGameStats } from '../end-game/playerGameStats';

/** Local game state assembled for table rendering. */
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
