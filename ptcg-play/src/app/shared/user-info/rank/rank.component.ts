import { Component, Input } from '@angular/core';
import { Rank } from 'ptcg-server';

@Component({
  selector: 'ptcg-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent {

  @Input() set rank(rank: Rank) {
    switch (rank) {
      case Rank.ADMIN:
        this.rankColor = 'warn';
        this.rankName = 'USERS_RANK_ADMIN';
        break;
      case Rank.MASTER:
        this.rankColor = 'red';
        this.rankName = 'USERS_RANK_MASTER';
        break;
        case Rank.ULTRA:
          this.rankColor = 'blue';
          this.rankName = 'USERS_RANK_ULTRA';
          break;
      case Rank.SENIOR:
        this.rankColor = 'orange';
        this.rankName = 'USERS_RANK_SENIOR';
        break;
      case Rank.JUNIOR:
        this.rankColor = 'green';
        this.rankName = 'USERS_RANK_JUNIOR';
        break;
      default:
        this.rankColor = '';
        this.rankName = 'USERS_RANK_UNKNOWN';
    }
  }

  @Input() ranking: number;
  public rankName: string;
  public rankColor: string;

  constructor() { }

}
