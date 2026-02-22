import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GameState, UserInfo } from 'ptcg-server';
import { map } from 'rxjs/operators';

import { LoginRememberService } from '../../login/login-remember.service';
import { SessionService } from '../../shared/session/session.service';
import { environment } from '../../../environments/environment';

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SettingsDialogComponent } from '../../table/table-sidebar/settings-dialog/settings-dialog.component';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { GamePhase } from 'ptcg-server';
import { ToolbarService } from '../../shared/services/toolbar.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() logoClick = new EventEmitter<void>();

  private loggedUser$: Observable<UserInfo | undefined>;
  public loggedUser: UserInfo | undefined;
  public gameStates$: Observable<LocalGameState[]>;
  public unreadMessages$: Observable<number>;
  public hasTableNotifications$: Observable<boolean>;
  public tableBadgeContent$: Observable<string>;
  public tableBadgeColor$: Observable<string>;
  public isAdmin$: Observable<boolean>;
  public menuOpen = false;

  apiUrl = environment.apiUrl;

  constructor(
    private loginRememberService: LoginRememberService,
    private router: Router,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private translate: TranslateService,
    private gameService: GameService,
    private toolbarService: ToolbarService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates).pipe(
      map(gameStates => gameStates.filter(gameState => {
        // Always include replays (they have replay property)
        if (gameState.replay) {
          return true;
        }

        // Filter out deleted games (unless they're replays, which we already handled above)
        if (gameState.deleted) {
          return false;
        }

        // Include all games that the user has joined, even if finished
        // The fact that they're in gameStates means the user joined/spectated them
        return true;
      }))
    );

    this.hasTableNotifications$ = this.gameStates$.pipe(
      map(gameStates => {
        const clientId = this.sessionService.session.clientId;
        return gameStates.some(gameState => {
          if (gameState.replay) {
            return false;
          }
          const state = gameState.state;
          const prompts = state.prompts.filter(p => p.result === undefined);
          const waitingForMe = prompts.some(p => p.playerId === clientId);
          const myTurn = state.players[state.activePlayer].id === clientId && state.phase === GamePhase.PLAYER_TURN;
          const waitingForInvitation = prompts.find(p => p.type === 'Invite player');
          return (waitingForMe && waitingForInvitation) || (waitingForMe || myTurn);
        });
      })
    );

    this.tableBadgeContent$ = this.gameStates$.pipe(
      map(gameStates => {
        const clientId = this.sessionService.session.clientId;
        for (const gameState of gameStates) {
          if (gameState.replay) {
            continue;
          }
          const state = gameState.state;
          const prompts = state.prompts.filter(p => p.result === undefined);
          const waitingForMe = prompts.some(p => p.playerId === clientId);
          const myTurn = state.players[state.activePlayer].id === clientId && state.phase === GamePhase.PLAYER_TURN;
          const waitingForInvitation = prompts.find(p => p.type === 'Invite player');

          if (waitingForMe && waitingForInvitation) {
            return '?';
          } else if (waitingForMe || myTurn) {
            return '!';
          }
        }
        return '';
      })
    );

    this.tableBadgeColor$ = this.gameStates$.pipe(
      map(gameStates => {
        const clientId = this.sessionService.session.clientId;
        for (const gameState of gameStates) {
          if (gameState.replay) {
            continue;
          }
          const state = gameState.state;
          const prompts = state.prompts.filter(p => p.result === undefined);
          const waitingForMe = prompts.some(p => p.playerId === clientId);
          const waitingForInvitation = prompts.find(p => p.type === 'Invite player');

          if (waitingForMe && waitingForInvitation) {
            return 'accent';
          } else if (waitingForMe || state.players[state.activePlayer].id === clientId && state.phase === GamePhase.PLAYER_TURN) {
            return 'primary';
          }
        }
        return 'primary';
      })
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

    this.loggedUser$ = this.sessionService.get(
      session => session.loggedUserId,
      session => session.users
    ).pipe(map(([loggedUserId, users]) => {
      return users[loggedUserId];
    }));

    this.isAdmin$ = this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    });
  }

  public ngOnInit() {
    this.loggedUser$
      .pipe(untilDestroyed(this))
      .subscribe(user => this.loggedUser = user);

    this.toolbarService.closeMenu$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.closeMenu());
  }

  public openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent);
  }

  public login() {
    this.router.navigate(['/login'], { queryParams: { redirectUrl: this.router.url } });
  }

  public logout() {
    this.loginRememberService.rememberToken();
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }

  public onLogoClick() {
    this.logoClick.emit();
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public closeMenu(): void {
    this.menuOpen = false;
  }

  async closeGame(gameState: LocalGameState) {
    if (gameState.state.players.some(p => p.id === this.sessionService.session.clientId)) {
      const result = await this.alertService.confirm(
        this.translate.instant('MAIN_LEAVE_GAME')
      );

      if (!result) {
        return;
      }
    }

    if (gameState.deleted) {
      this.gameService.removeLocalGameState(gameState.localId);
    } else {
      this.gameService.leave(gameState.gameId);
    }
  }
}
