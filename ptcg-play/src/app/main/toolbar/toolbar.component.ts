import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GameState, UserInfo } from 'ptcg-server';
import { map } from 'rxjs/operators';

import { LoginRememberService } from '../../login/login-remember.service';
import { SessionService } from '../../shared/session/session.service';
import { environment } from '../../../environments/environment';

import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../../table/table-sidebar/settings-dialog/settings-dialog.component';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { GamePhase } from 'ptcg-server';

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

  apiUrl = environment.apiUrl;

  constructor(
    private loginRememberService: LoginRememberService,
    private router: Router,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private translate: TranslateService,
    private gameService: GameService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);

    this.hasTableNotifications$ = this.gameStates$.pipe(
      map(gameStates => {
        const clientId = this.sessionService.session.clientId;
        return gameStates.some(gameState => {
          if (gameState.replay || gameState.deleted) {
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
          if (gameState.replay || gameState.deleted) {
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
          if (gameState.replay || gameState.deleted) {
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
  }

  public ngOnInit() {
    this.loggedUser$
      .pipe(untilDestroyed(this))
      .subscribe(user => this.loggedUser = user);
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
