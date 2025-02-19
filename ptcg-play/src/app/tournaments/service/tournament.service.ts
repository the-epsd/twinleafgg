import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tournament, TournamentPlayer, TournamentMatch, TournamentStatus } from '../../tournaments/model/tournament.model';
import { ArchetypeUtils } from '../../deck/deck-archetype-service/archetype.utils';
import { ApiService } from 'src/app/api/api.service';

export interface TournamentResponse extends Response {
  tournament: Tournament;
}

export interface TournamentsResponse extends Response {
  tournaments: Tournament[];
}

export interface TournamentPlayerResponse extends Response {
  player: TournamentPlayer;
}

export interface TournamentMatchResponse extends Response {
  match: TournamentMatch;
}

export interface MetagameResponse extends Response {
  data: { archetype: string, count: number }[];
}

@Injectable()
export class TournamentService {
  constructor(private api: ApiService) { }

  getTournaments(status?: TournamentStatus): Observable<Tournament[]> {
    const url = status ? `/v1/tournaments/list?status=${status}` : '/v1/tournaments/list';
    return this.api.get<TournamentsResponse>(url).pipe(
      map(response => response.tournaments)
    );
  }

  getTournamentById(id: number): Observable<Tournament> {
    return this.api.get<TournamentResponse>(`/v1/tournaments/get/${id}`).pipe(
      map(response => response.tournament)
    );
  }

  createTournament(tournament: Partial<Tournament>): Observable<Tournament> {
    return this.api.post<TournamentResponse>('/v1/tournaments/create', tournament).pipe(
      map(response => response.tournament)
    );
  }

  updateTournament(id: number, tournament: Partial<Tournament>): Observable<Tournament> {
    return this.api.post<TournamentResponse>(`/v1/tournaments/update/${id}`, tournament).pipe(
      map(response => response.tournament)
    );
  }

  registerPlayer(tournamentId: number, userId: string, decklist: string): Observable<TournamentPlayer> {
    const archetype = ArchetypeUtils.getArchetype(JSON.parse(decklist));
    return this.api.post<TournamentPlayerResponse>(`/v1/tournaments/${tournamentId}/register`, {
      userId,
      decklist,
      archetype
    }).pipe(
      map(response => response.player)
    );
  }

  getMetagameData(tournamentId: number): Observable<{ archetype: string, count: number }[]> {
    return this.api.get<MetagameResponse>(`/v1/tournaments/${tournamentId}/metagame`).pipe(
      map(response => response.data)
    );
  }

  updateMatchResult(tournamentId: number, matchId: number, result: Partial<TournamentMatch>): Observable<TournamentMatch> {
    return this.api.post<TournamentMatchResponse>(
      `/v1/tournaments/${tournamentId}/matches/${matchId}`,
      result
    ).pipe(
      map(response => response.match)
    );
  }

  startNextRound(tournamentId: number): Observable<Tournament> {
    return this.api.post<TournamentResponse>(`/v1/tournaments/${tournamentId}/next-round`, {}).pipe(
      map(response => response.tournament)
    );
  }

  completeTournament(tournamentId: number): Observable<Tournament> {
    return this.api.post<TournamentResponse>(`/v1/tournaments/${tournamentId}/complete`, {}).pipe(
      map(response => response.tournament)
    );
  }

  canCreateTournament(username: string): boolean {
    return username === 'TheEPSD';
  }
}