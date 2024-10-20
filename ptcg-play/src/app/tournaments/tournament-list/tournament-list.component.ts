import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from 'src/app/api/models/tournament.model';
import { TournamentService } from 'src/app/api/services/tournament.service';


@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss']
})
export class TournamentListComponent implements OnInit {
  activeTournaments: Tournament[] = [];
  upcomingTournaments: Tournament[] = [];

  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeTournaments = this.tournamentService.getAvailableTournaments();
    this.upcomingTournaments = this.tournamentService.getUpcomingTournaments();
  }

  createTournament() {
    this.router.navigate(['/tournaments/create']);
  }

  viewTournament(id: string) {
    this.router.navigate(['/tournaments', id]);
  }

  joinTournament(id: string) {
    this.tournamentService.joinTournament(id, 'currentUserId');
    this.router.navigate(['/tournaments', id]);
  }
}
