import { AvailableActionsView, HeadlessCommandRequest, HeadlessPromptJson } from './engine';

export interface PlayableCard {
  cardId: number;
  handIndex: number;
  name: string;
}

// Public zones every seat may see about either player.
export interface SeatPublicView {
  id: number;
  name: string;
  deckCount: number;
  discard: any[];
  lostZone: any[];
  stadium: any[];
  playZone: any[];
  prizesLeft: number;
  active: any;
  bench: any[];
}

export interface SeatSelfView extends SeatPublicView {
  hand: any[];
  availableActions?: AvailableActionsView;
}

export interface SeatOpponentView extends SeatPublicView {
  handCount: number;
}

export interface FailedAttempt {
  command: HeadlessCommandRequest;
  error: string;
}

export interface SeatView {
  seatIndex: number;
  phase: number;
  turn: number;
  isMyTurn: boolean;
  me: SeatSelfView;
  opponent: SeatOpponentView;
  playableCards: PlayableCard[];
  // Set when this seat must answer a prompt instead of taking a board action.
  pendingPrompt?: HeadlessPromptJson;
  // Attempts rejected by the engine for the current decision (retry context).
  failedAttempts: FailedAttempt[];
}

export interface Seat {
  readonly name: string;
  act(view: SeatView): HeadlessCommandRequest;
}

export interface DecisionRecord {
  seq: number;
  seatIndex: number;
  decisionType: 'prompt' | 'board';
  view: SeatView;
  command: HeadlessCommandRequest;
  failedAttempts: FailedAttempt[];
  forced: boolean;
  // Engine replay-action events produced by executing the command.
  events: any[];
}

export type GameOutcome = 'finished' | 'capped' | 'error';

export interface GameResult {
  outcome: GameOutcome;
  // Seat index of the winner, or null for draw / no winner.
  winnerSeat: number | null;
  rawWinner: number;
  turns: number;
  commands: number;
  illegalAttempts: number;
  durationMs: number;
  error?: string;
}
