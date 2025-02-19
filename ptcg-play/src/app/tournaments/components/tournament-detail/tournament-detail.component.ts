import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TournamentService } from '../../service/tournament.service';
import { WebSocketService } from '../../service/tournament-socket.service';
import { Tournament } from '../../model/tournament.model';

@Component({
  selector: 'app-tournament-detail',
  template: `
    <mat-card *ngIf="tournament">
      <mat-card-header>
        <mat-card-title>{{tournament.name}}</mat-card-title>
        <mat-card-subtitle>{{tournament.format}} - {{tournament.date | date:'medium'}}</mat-card-subtitle>
      </mat-card-header>

      <mat-tab-group>
        <mat-tab label="Info">
          <div class="tournament-info">
            <pre>{{tournament.description}}</pre>
            <div class="tournament-meta">
              <p>Players: {{tournament.players?.length || 0}}/{{tournament.maxPlayers}}</p>
              <p>Rounds: {{tournament.rounds}}</p>
              <p *ngIf="tournament.hasTopCut">Top Cut: Top 8</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Standings">
          <app-tournament-standings 
            [players]="tournament.players"
            [currentRound]="tournament.currentRound">
          </app-tournament-standings>
        </mat-tab>

        <mat-tab label="Pairings">
          <app-tournament-pairings 
            [matches]="tournament.matches"
            [currentRound]="tournament.currentRound">
          </app-tournament-pairings>
        </mat-tab>

        <mat-tab label="Metagame">
          <app-tournament-metagame 
            [tournamentId]="tournament.id">
          </app-tournament-metagame>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
  styles: [`
    .tournament-info {
      padding: 20px;
    }
    .tournament-info pre {
      white-space: pre-wrap;
      font-family: inherit;
    }
    .tournament-meta {
      margin-top: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class TournamentDetailComponent implements OnInit, OnDestroy {
  tournament: Tournament | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private wsService: WebSocketService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadTournament(id);
      this.setupWebSocket(id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTournament(id: number) {
    this.tournamentService.getTournamentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tournament => {
        this.tournament = tournament;
      });
  }

  private setupWebSocket(tournamentId: number) {
    this.wsService.joinTournament(tournamentId);

    this.wsService.onTournamentUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tournament => {
        this.tournament = tournament;
      });
  }
}