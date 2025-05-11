import { Component, OnInit, ViewChild } from '@angular/core';
import { GameInfo, ClientInfo } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { Observable, EMPTY, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { ClientUserData } from '../api/interfaces/main.interface';
import { CreateGamePopupComponent, CreateGamePopupResult } from './create-game-popup/create-game-popup.component';
import { DeckService } from '../api/services/deck.service';
import { MainService } from '../api/services/main.service';
import { SelectPopupOption } from '../shared/alert/select-popup/select-popup.component';
import { SessionService } from '../shared/session/session.service';
import { UserInfoMap } from '../shared/session/session.interface';
import { Deck, DeckListEntry } from '../api/interfaces/deck.interface';
import { MatchmakingLobbyComponent } from './matchmaking-lobby/matchmaking-lobby.component';
import { ProfileService } from '../api/services/profile.service';
import { GameService } from '../api/services/game.service';
import { SocketService } from '../api/socket.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  providers: []
})
export class GamesComponent implements OnInit {
  @ViewChild(MatchmakingLobbyComponent) matchmakingLobby: MatchmakingLobbyComponent;
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public clients$: Observable<ClientInfo[]>;
  public games$: Observable<GameInfo[]>;
  public loading = false;
  public clientId: number;
  public loggedUserId: number;
  public lobbyComponent = MatchmakingLobbyComponent;
  public isAdmin$: Observable<boolean>;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private dialog: MatDialog,
    private mainSevice: MainService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private router: Router,
    private profileService: ProfileService,
    private gameService: GameService,
    private socketService: SocketService
  ) {
    this.clients$ = this.sessionService.get(
      session => session.users,
      session => session.clients
    ).pipe(map(([users, clients]: [UserInfoMap, ClientInfo[]]) => {
      const values = clients.map(c => ({
        ...c,
        user: users[c.userId]
      }));
      values.sort((client1, client2) => {
        return client2.user.ranking - client1.user.ranking;
      });
      return values;
    }));
    this.games$ = this.sessionService.get(session => session.games);
    this.isAdmin$ = this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    });
  }

  ngOnInit() {
    this.sessionService.get(session => session.loggedUserId)
      .pipe(untilDestroyed(this))
      .subscribe(userId => {
        this.loggedUserId = userId;
      });

    this.sessionService.get(session => session.clientId)
      .pipe(untilDestroyed(this))
      .subscribe(clientId => {
        this.clientId = clientId;
      });

    // Listen for player disconnect/reconnect events
    this.socketService.on('game:playerDisconnect', (data: { gameId: number, playerId: number }) => {
      this.updateGamePlayerStatus(data.gameId, data.playerId, true);
    });

    this.socketService.on('game:playerReconnect', (data: { gameId: number, playerId: number }) => {
      this.updateGamePlayerStatus(data.gameId, data.playerId, false);
    });
  }

  private updateGamePlayerStatus(gameId: number, playerId: number, isDisconnected: boolean) {
    const games = this.sessionService.session.games;
    const gameIndex = games.findIndex(g => g.gameId === gameId);

    if (gameIndex !== -1) {
      const game = games[gameIndex];
      const updatedGame = {
        ...game,
        players: game.players.map(p =>
          p.clientId === playerId ? { ...p, disconnected: isDisconnected } : p
        )
      };

      const updatedGames = [...games];
      updatedGames[gameIndex] = updatedGame;
      this.sessionService.set({ games: updatedGames });
    }
  }

  private showCreateGamePopup(decks: SelectPopupOption<DeckListEntry>[]): Promise<CreateGamePopupResult> {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { decks }
    });
    return dialog.afterClosed().toPromise();
  }

  public createGame(invitedId?: number) {
    this.loading = true;
    this.deckService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
        switchMap(decks => {
          const options = decks.decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => {
              return { value: deckEntry, viewValue: deckEntry.name }
            });

          if (options.length === 0) {
            this.alertService.alert(
              this.translate.instant('GAMES_NEED_DECK'),
              this.translate.instant('GAMES_NEED_DECK_TITLE')
            );
            return EMPTY;
          }

          return from(this.showCreateGamePopup(options));
        }),
        switchMap(result => {
          this.loading = true;
          return result !== undefined
            ? this.deckService.getDeck(result.deckId).pipe(map(deckResult => ({
              deck: deckResult.deck.cards,
              gameSettings: result.gameSettings
            })))
            : EMPTY;
        }),
        switchMap(data => {
          return this.mainSevice.createGame(data.deck, data.gameSettings, invitedId);
        }),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: () => { },
        error: (error: ApiError) => {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      });
  }

  banUser(userId: number) {
    const isBanned = this.sessionService.session.users[userId]?.roleId === 1;
    const newRoleId = isBanned ? 2 : 1; // 2 is regular user, 1 is banned
    const successMessage = isBanned ? 'PROFILE_UNBAN_SUCCESS' : 'PROFILE_BAN_SUCCESS';
    const errorMessage = isBanned ? 'PROFILE_UNBAN_ERROR' : 'PROFILE_BAN_ERROR';

    this.profileService.updateUserRole(userId, newRoleId).subscribe({
      next: () => {
        this.alertService.toast(this.translate.instant(successMessage));
        const users = { ...this.sessionService.session.users };
        if (users[userId]) {
          users[userId] = { ...users[userId], roleId: newRoleId };
          this.sessionService.set({ users });
        }
      },
      error: async error => {
        await this.alertService.error(this.translate.instant(errorMessage));
      }
    });
  }
}
