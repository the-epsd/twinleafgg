import { Component, Input, OnChanges } from '@angular/core';
import { TournamentMatch, TournamentPlayer } from '../../model/tournament.model';


@Component({
  selector: 'app-tournament-pairings',
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let round of rounds; let i = index"
                          [expanded]="currentRound === i + 1">
        <mat-expansion-panel-header>
          <mat-panel-title>
            Round {{i + 1}}
          </mat-panel-title>
          <mat-panel-description>
            {{getCompletedMatches(round)}} / {{round.length}} Matches Complete
          </mat-panel-description>
        </mat-expansion-panel-header>

        <table mat-table [dataSource]="round" class="pairings-table">
          <ng-container matColumnDef="table">
            <th mat-header-cell *matHeaderCellDef> Table </th>
            <td mat-cell *matCellDef="let match; let i = index"> {{i + 1}} </td>
          </ng-container>

          <ng-container matColumnDef="player1">
            <th mat-header-cell *matHeaderCellDef> Player 1 </th>
            <td mat-cell *matCellDef="let match" 
                [class.winner]="match.winner === match.player1Id">
              {{getPlayerName(match.player1Id)}}
              <ptcg-archetype [class]="getPlayerArchetype(match.player1Id)">
              </ptcg-archetype>
            </td>
          </ng-container>

          <ng-container matColumnDef="result">
            <th mat-header-cell *matHeaderCellDef> Result </th>
            <td mat-cell *matCellDef="let match">
              <span *ngIf="match.completed">
                {{match.player1Points}} - {{match.player2Points}}
              </span>
              <span *ngIf="!match.completed">
                In Progress
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="player2">
            <th mat-header-cell *matHeaderCellDef> Player 2 </th>
            <td mat-cell *matCellDef="let match"
                [class.winner]="match.winner === match.player2Id">
              {{getPlayerName(match.player2Id)}}
              <ptcg-archetype [class]="getPlayerArchetype(match.player2Id)">
              </ptcg-archetype>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    .pairings-table {
      width: 100%;
      margin: 16px 0;
    }
    .winner {
      font-weight: bold;
    }
  `]
})
export class TournamentPairingsComponent implements OnChanges {
  @Input() matches: TournamentMatch[] = [];
  @Input() players: TournamentPlayer[] = [];
  @Input() currentRound: number = 0;

  displayedColumns = ['table', 'player1', 'result', 'player2'];
  rounds: TournamentMatch[][] = [];

  ngOnChanges() {
    this.organizeRounds();
  }

  private organizeRounds() {
    this.rounds = [];
    const maxRound = Math.max(...this.matches.map(m => m.round));

    for (let i = 1; i <= maxRound; i++) {
      this.rounds.push(
        this.matches.filter(m => m.round === i)
      );
    }
  }

  getCompletedMatches(matches: TournamentMatch[]): number {
    return matches.filter(m => m.completed).length;
  }

  getPlayerName(playerId: number): string {
    const player = this.players.find(p => p.id === playerId);
    return player?.userId || 'Unknown';
  }

  getPlayerArchetype(playerId: number): string {
    const player = this.players.find(p => p.id === playerId);
    return player?.archetype || 'unknown';
  }
}