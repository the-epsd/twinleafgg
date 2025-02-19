import { Archetype } from 'ptcg-server';

export enum TournamentStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export enum TournamentFormat {
  STANDARD = 'STANDARD',
  EXPANDED = 'EXPANDED',
  LEGACY = 'LEGACY',
  CUSTOM = 'CUSTOM'
}

export interface Tournament {
  id: number;
  name: string;
  format: string;
  date: Date;
  status: TournamentStatus;
  rounds: number;
  currentRound: number;
  maxPlayers: number;
  description?: string;
  createdBy: string;
  hasTopCut: boolean;
  registrationDeadline: Date;
  players: TournamentPlayer[];  // Added this
  matches?: TournamentMatch[];
}

export interface TournamentPlayer {
  id: number;
  tournamentId: number;
  userId: string;
  decklist: string;
  archetype: Archetype;
  points: number;
  active: boolean;
}

export interface TournamentMatch {
  id: number;
  tournamentId: number;
  round: number;
  player1Id: number;
  player2Id: number;
  player1Points: number;
  player2Points: number;
  completed: boolean;
  winner?: number;  // playerId of winner, null if tie
}