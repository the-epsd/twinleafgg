// tournament-creation.component.ts
import { Component } from '@angular/core';
import { TournamentService } from 'src/app/api/services/tournament.service';


@Component({
  selector: 'app-tournament-creation',
  template: `
    <form (ngSubmit)="createTournament()">
      <input [(ngModel)]="tournamentName" placeholder="Tournament Name" required>
      <input [(ngModel)]="startTime" type="datetime-local" required>
      <button type="submit">Create Tournament</button>
    </form>
  `
})
export class TournamentCreationComponent {
  tournamentName: string;
  startTime: string;

  constructor(private tournamentService: TournamentService) { }

  createTournament() {
    const startDate = new Date(this.startTime);
    this.tournamentService.createTournament(this.tournamentName, 'currentUserId', startDate);
  }
}
