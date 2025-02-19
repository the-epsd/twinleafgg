import { Component, OnInit } from '@angular/core';
import { Tournament, TournamentStatus } from '../../model/tournament.model';
import { TournamentService } from '../../service/tournament.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-tournament-list',
  template: `
    <mat-tab-group>
      <mat-tab label="Completed">
        <mat-list>
          <mat-list-item *ngFor="let tournament of completedTournaments" 
                         [routerLink]="['/tournaments', tournament.id]">
            <h3 matLine>{{tournament.name}}</h3>
            <p matLine>{{tournament.date | date}}</p>
          </mat-list-item>
        </mat-list>
      </mat-tab>
      
      <mat-tab label="Upcoming">
        <mat-list>
          <mat-list-item *ngFor="let tournament of upcomingTournaments">
            <h3 matLine>{{tournament.name}}</h3>
            <p matLine>
              {{tournament.date | date}} - 
              {{tournament.registeredPlayers}}/{{tournament.maxPlayers}} Players
            </p>
            <button mat-button 
                    *ngIf="canRegister(tournament)"
                    (click)="register(tournament)">
              Register
            </button>
          </mat-list-item>
        </mat-list>
      </mat-tab>
      
      <mat-tab label="Ongoing">
        <mat-list>
          <mat-list-item *ngFor="let tournament of ongoingTournaments"
                         [routerLink]="['/tournaments', tournament.id]">
            <h3 matLine>{{tournament.name}}</h3>
            <p matLine>Round {{tournament.currentRound}}/{{tournament.rounds}}</p>
          </mat-list-item>
        </mat-list>
      </mat-tab>
    </mat-tab-group>
  `
})
export class TournamentListComponent implements OnInit {
  completedTournaments: Tournament[] = [];
  upcomingTournaments: Tournament[] = [];
  ongoingTournaments: Tournament[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.loadTournaments();
  }

  private loadTournaments() {
    this.tournamentService.getTournaments(TournamentStatus.COMPLETED)
      .subscribe(tournaments => this.completedTournaments = tournaments);

    this.tournamentService.getTournaments(TournamentStatus.UPCOMING)
      .subscribe(tournaments => this.upcomingTournaments = tournaments);

    this.tournamentService.getTournaments(TournamentStatus.ONGOING)
      .subscribe(tournaments => this.ongoingTournaments = tournaments);
  }

  canRegister(tournament: Tournament): boolean {
    const now = new Date();
    return now < tournament.registrationDeadline;
  }

  register(tournament: Tournament) {
    // Open dialog for decklist submission
  }
}