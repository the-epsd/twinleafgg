import { Component, Input, OnInit } from '@angular/core';
import { TournamentService } from '../../service/tournament.service';

@Component({
  selector: 'app-tournament-metagame',
  template: `
    <div class="metagame-container">
      <!-- Visual representation using bars -->
      <div class="metagame-visual">
        <div *ngFor="let data of metagameData" class="archetype-bar">
          <div class="bar-label">
            <ptcg-archetype [class]="data.archetype"></ptcg-archetype>
            {{(data.count / totalDecks * 100).toFixed(1)}}%
          </div>
          <div class="bar" [style.width.%]="(data.count / totalDecks * 100)"></div>
        </div>
      </div>
      
      <table mat-table [dataSource]="metagameData" class="metagame-table">
        <ng-container matColumnDef="archetype">
          <th mat-header-cell *matHeaderCellDef> Archetype </th>
          <td mat-cell *matCellDef="let data">
            <ptcg-archetype [class]="data.archetype"></ptcg-archetype>
          </td>
        </ng-container>

        <ng-container matColumnDef="count">
          <th mat-header-cell *matHeaderCellDef> Count </th>
          <td mat-cell *matCellDef="let data"> {{data.count}} </td>
        </ng-container>

        <ng-container matColumnDef="percentage">
          <th mat-header-cell *matHeaderCellDef> % of Field </th>
          <td mat-cell *matCellDef="let data"> 
            {{(data.count / totalDecks * 100).toFixed(1)}}%
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .metagame-container {
      padding: 16px;
    }
    .metagame-visual {
      margin: 24px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .archetype-bar {
      margin: 12px 0;
    }
    .bar-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .bar {
      height: 24px;
      background: #3f51b5;
      border-radius: 12px;
      transition: width 0.3s ease;
      min-width: 2%;
    }
    .metagame-table {
      width: 100%;
      margin-top: 24px;
    }
  `]
})
export class TournamentMetagameComponent implements OnInit {
  @Input() tournamentId!: number;

  metagameData: { archetype: string, count: number }[] = [];
  displayedColumns = ['archetype', 'count', 'percentage'];
  totalDecks = 0;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.loadMetagameData();
  }

  private loadMetagameData() {
    this.tournamentService.getMetagameData(this.tournamentId)
      .subscribe(data => {
        // Sort data by count in descending order
        this.metagameData = data.sort((a, b) => b.count - a.count);
        this.totalDecks = data.reduce((sum, item) => sum + item.count, 0);
      });
  }
}