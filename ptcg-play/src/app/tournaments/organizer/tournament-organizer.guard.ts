import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { SessionService } from '../../shared/session/session.service';
import { TournamentService } from '../service/tournament.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentOrganizerGuard implements CanActivate {
  constructor(
    private tournamentService: TournamentService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const loggedUserId = this.sessionService.session.loggedUserId;
    if (!loggedUserId) {
      this.router.navigate(['/login']);
      return false;
    }

    const currentUser = this.sessionService.session.users[loggedUserId];
    if (currentUser && this.tournamentService.canCreateTournament(currentUser.name)) {
      return true;
    }

    this.router.navigate(['/tournaments']);
    return false;
  }
}