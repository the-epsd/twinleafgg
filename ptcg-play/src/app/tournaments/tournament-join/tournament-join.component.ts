// tournament-joining.component.ts
import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/api/models/tournament.model';
import { TournamentService } from 'src/app/api/services/tournament.service';

@Component({
  selector: 'app-tournament-joining',
  template: `
    <div *ngFor="let tournament of availableTournaments">
      {{ tournament.name }} - {{ tournament.startTime | date:'medium' }}
      <button (click)="joinTournament(tournament.id)">Join</button>
    </div>
  `
})
export class TournamentJoiningComponent implements OnInit {
  availableTournaments: Tournament[];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.availableTournaments = this.tournamentService.getAvailableTournaments();
  }

  joinTournament(tournamentId: string) {
    this.tournamentService.joinTournament(tournamentId, 'currentUserId');
  }
}
