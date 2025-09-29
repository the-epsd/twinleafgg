import { GameWinner } from '../../game';

export interface MatchInfo {
  matchId: number;
  player1Id: number;
  player2Id: number;
  ranking1: number;
  ranking2: number;
  rankingStake1: number;
  rankingStake2: number;
  winner: GameWinner;
  created: number;
  player1Archetype?: string;
  player2Archetype?: string;
  player1DeckName?: string;
  player2DeckName?: string;
  player1DeckId?: number;
  player2DeckId?: number;
}
