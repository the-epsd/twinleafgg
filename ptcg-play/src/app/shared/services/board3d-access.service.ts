import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class Board3dAccessService {

  constructor(private sessionService: SessionService) { }

  /**
   * Observable that emits true if the current logged-in user has 3D board access,
   * false otherwise. Updates automatically when session changes.
   */
  public has3dBoardAccess$: Observable<boolean> = this.sessionService.get(
    session => session.loggedUserId,
    session => session.users,
    session => session.config
  ).pipe(
    map(([loggedUserId, users, config]) => {
      if (!loggedUserId || !users || !config) {
        return false;
      }

      const loggedUser = users[loggedUserId];
      if (!loggedUser || !loggedUser.name) {
        return false;
      }

      const whitelist = config.board3dWhitelist || [];
      return whitelist.includes(loggedUser.name);
    })
  );

  /**
   * Synchronously check if the current logged-in user has 3D board access.
   * Returns false if user is not logged in or not on the whitelist.
   */
  public has3dBoardAccess(): boolean {
    const session = this.sessionService.session;
    const loggedUserId = session.loggedUserId;
    const users = session.users;
    const config = session.config;

    if (!loggedUserId || !users || !config) {
      return false;
    }

    const loggedUser = users[loggedUserId];
    if (!loggedUser || !loggedUser.name) {
      return false;
    }

    const whitelist = config.board3dWhitelist || [];
    return whitelist.includes(loggedUser.name);
  }
}
