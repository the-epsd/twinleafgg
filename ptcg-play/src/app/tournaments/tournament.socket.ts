import { Socket } from 'socket.io-client';
import { Tournament, TournamentMatch } from './model/tournament.model';
import { TournamentService } from './service/tournament.service';


export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

export class TournamentSocket {
  private socket: Socket;

  constructor(socket: Socket, private tournamentService: TournamentService) {
    this.socket = socket;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to tournament socket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from tournament socket');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  // Join a tournament room
  public joinTournament(tournamentId: number) {
    this.socket.emit('tournament:join', tournamentId);
  }

  // Leave a tournament room
  public leaveTournament(tournamentId: number) {
    this.socket.emit('tournament:leave', tournamentId);
  }

  // Send match completion
  public sendMatchComplete(data: {
    tournamentId: number,
    matchId: number,
    winner: string,
    player1Points: number,
    player2Points: number
  }) {
    this.socket.emit('tournament:matchComplete', data);
  }

  // Listen for tournament updates
  public onTournamentUpdate(callback: (tournament: Tournament) => void) {
    this.socket.on('tournament:update', callback);
  }

  // Listen for match updates
  public onMatchUpdate(callback: (match: TournamentMatch) => void) {
    this.socket.on('tournament:matchUpdate', callback);
  }

  // Listen for round start
  public onRoundStart(callback: (data: { tournamentId: number, roundNumber: number }) => void) {
    this.socket.on('tournament:roundStart', callback);
  }

  // Listen for tournament completion
  public onTournamentComplete(callback: (tournament: Tournament) => void) {
    this.socket.on('tournament:complete', callback);
  }

  // Clean up listeners when component is destroyed
  public disconnect() {
    this.socket.off('tournament:update');
    this.socket.off('tournament:matchUpdate');
    this.socket.off('tournament:roundStart');
    this.socket.off('tournament:complete');
  }
}