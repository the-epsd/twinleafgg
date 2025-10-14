import { Component } from '@angular/core';
import { GameState, GamePhase } from 'ptcg-server';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionService } from '../../shared/session/session.service';
import { LocalGameState } from '../../shared/session/session.interface';

@Component({
  selector: 'ptcg-sidenav',
  exportAs: 'ptcgSidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public gameStates$: Observable<LocalGameState[]>;
  public unreadMessages$: Observable<number>;

  constructor(
    private sessionService: SessionService,
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates).pipe(
      map(gameStates => gameStates.filter(gameState => {
        // Filter out finished games, games with gameOver flag, and deleted games
        if (gameState.deleted || gameState.gameOver) {
          return false;
        }
        // Check if game is in FINISHED phase
        if (gameState.state && gameState.state.phase === GamePhase.FINISHED) {
          return false;
        }
        return true;
      }))
    );

    this.unreadMessages$ = this.sessionService.get(session => {
      let unread = 0;
      session.conversations.forEach(c => {
        const message = c.lastMessage;
        if (message.senderId !== session.loggedUserId && !message.isRead) {
          unread += 1;
        }
      });
      return unread;
    });

  }

}
