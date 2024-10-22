import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournaments: Tournament[] = [];

  createTournament(name: string, creator: string, startTime: Date): Tournament {
    const tournament = new Tournament(name, creator, startTime);
    this.tournaments.push(tournament);
    return tournament;
  }

  joinTournament(tournamentId: string, playerId: string): void {
    const tournament = this.getTournamentById(tournamentId);
    if (tournament && tournament.status === 'pending') {
      tournament.participants.push(playerId);
    }
  }

  startTournament(tournamentId: string): void {
    const tournament = this.getTournamentById(tournamentId);
    if (tournament) {
      tournament.status = 'active';
      tournament.bracket = this.generateBracket(tournament.participants);
    }
  }

  updateMatchResult(tournamentId: string, matchId: string, winnerId: string): void {
    // Implement logic to update the bracket based on match results
  }

  private getTournamentById(id: string): Tournament | undefined {
    return this.tournaments.find(t => t.id === id);
  }

  private generateBracket(participants: string[]): any {
    // Implement bracket generation logic
  }

  getAvailableTournaments(): Tournament[] {
    const now = new Date();
    return this.tournaments.filter(tournament =>
      tournament.status === 'pending' && tournament.startTime > now
    );
  }

  getUpcomingTournaments(): Tournament[] {
    const now = new Date();
    return this.tournaments.filter(tournament =>
      tournament.status === 'pending' && tournament.startTime > now
    );
  }

}