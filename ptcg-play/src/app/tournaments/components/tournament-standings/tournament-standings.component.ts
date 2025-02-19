import { Component, Input, OnChanges } from '@angular/core';
import { TournamentPlayer } from '../../model/tournament.model';


@Component({
  selector: 'app-tournament-standings',
  template: `
    <table mat-table [dataSource]="sortedPlayers" class="standings-table">
      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef> Rank </th>
        <td mat-cell *matCellDef="let player; let i = index"> {{i + 1}} </td>
      </ng-container>

      <ng-container matColumnDef="player">
        <th mat-header-cell *matHeaderCellDef> Player </th>
        <td mat-cell *matCellDef="let player"> {{player.userId}} </td>
      </ng-container>

      <ng-container matColumnDef="points">
        <th mat-header-cell *matHeaderCellDef> Points </th>
        <td mat-cell *matCellDef="let player"> {{player.points}} </td>
      </ng-container>

      <ng-container matColumnDef="archetype">
        <th mat-header-cell *matHeaderCellDef> Deck </th>
        <td mat-cell *matCellDef="let player">
          <ptcg-archetype [class]="player.archetype"></ptcg-archetype>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .standings-table {
      width: 100%;
      margin-top: 16px;
    }
  `]
})
export class TournamentStandingsComponent implements OnChanges {
  @Input() players: TournamentPlayer[] = [];
  @Input() currentRound: number = 0;

  displayedColumns = ['rank', 'player', 'points', 'archetype'];
  sortedPlayers: TournamentPlayer[] = [];

  ngOnChanges() {
    this.sortPlayers();
  }

  private sortPlayers() {
    this.sortedPlayers = [...this.players].sort((a, b) => {
      // Sort by points descending
      return b.points - a.points;
    });
  }
}