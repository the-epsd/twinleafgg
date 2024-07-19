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
        this.rankColor = 'platinum';
        this.rankName = 'USERS_RANK_MASTER';
        break;
      case Rank.ULTRA:
        this.rankColor = '#d09328';
        this.rankName = 'USERS_RANK_ULTRA';
        break;
      case Rank.GREAT:
        this.rankColor = '#778bae';
        this.rankName = 'USERS_RANK_GREAT';
        break;
      case Rank.POKE:
        this.rankColor = '#905921';
        this.rankName = 'USERS_RANK_POKE';
        break;
      case Rank.BANNED:
        this.rankColor = 'banned';
        this.rankName = 'USERS_RANK_BANNED';
        break;
      default:
        this.rankColor = '';
        this.rankName = 'USERS_RANK_UNKNOWN';
    }

  }

  @Input() ranking: number;
  public rankName: string;
  public rankColor: string;
  public isAdmin = false;

  constructor() { }

}
