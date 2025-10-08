import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GameInfo, ClientInfo } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { Observable, EMPTY, from, combineLatest, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, switchMap, map, catchError, startWith } from 'rxjs/operators';
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
import { FriendsService } from '../api/services/friends.service';
import { FriendInfo } from '../api/interfaces/friends.interface';
import { Format } from 'ptcg-server';
import { ReconnectionDialogComponent } from '../shared/components/reconnection-dialog/reconnection-dialog.component';

@UntilDestroy()
@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  providers: []
})
export class GamesComponent implements OnInit, OnDestroy {
  @ViewChild(MatchmakingLobbyComponent) matchmakingLobby: MatchmakingLobbyComponent;
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public clients$: Observable<ClientInfo[]>;
  public games$: Observable<GameInfo[]>;
  public friendsList$: Observable<any[]>;
  public nonFriendClients$: Observable<ClientInfo[]>;
  public loading = false;
  public clientId: number;
  public loggedUserId: number;
  public lobbyComponent = MatchmakingLobbyComponent;
  public isAdmin$: Observable<boolean>;
  public sidebarMenuOpen = true;
  public selectedFormat: Format | null = null;
  public isDevelopmentMode = true; // Set to false in production

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
    private friendsService: FriendsService
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

    // Initialize friends list with proper error handling
    this.friendsList$ = this.friendsService.getFriendsList().pipe(
      map(response => {
        if (!response.friends) return [];

        // Extract friend users - need to determine which user is the friend
        return response.friends
          .filter(friendInfo => friendInfo.status === 'accepted')
          .map(friendInfo => {
            // Determine which user is the friend (not the current user)
            const currentUserId = this.sessionService.session.loggedUserId;
            const friendUser = friendInfo.user.userId === currentUserId
              ? friendInfo.friend
              : friendInfo.user;

            return {
              userId: friendUser.userId,
              name: friendUser.name,
              ranking: friendUser.ranking,
              roleId: friendUser.roleId,
              avatarFile: friendUser.avatarFile
            };
          });
      }),
      catchError(error => {
        console.error('Failed to load friends list:', error);
        return of([]); // Return empty array on error
      }),
      startWith([]) // Start with empty array while loading
    );

    // Filter out friends from the clients list
    this.nonFriendClients$ = combineLatest([
      this.clients$,
      this.friendsList$
    ]).pipe(
      map(([clients, friends]) => {

        const friendUserIds = friends.map(friend => friend.userId);
        const filtered = clients.filter((client: any) =>
          !friendUserIds.includes(client.user?.userId)
          // Removed the filter that excluded the current user
        );
        return filtered;
      })
    );
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
  }

  ngOnDestroy() {
    // No cleanup needed for always-open sidebar
  }

  public isPlayerOnline(userId: number): boolean {
    const session = this.sessionService.session;
    if (!session.clients) return false;

    return session.clients.some(client => client.userId === userId);
  }

  public onMenuOpened(): void {
    // Sidebar is always open now, no action needed
  }

  public onMenuClosed(): void {
    // Sidebar is always open now, no action needed
  }

  public toggleSidebar(): void {
    // Sidebar is always open now, no action needed
  }

  private showCreateGamePopup(decks: SelectPopupOption<DeckListEntry>[], invitedUserId?: number): Promise<CreateGamePopupResult> {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { decks, invitedUserId }
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

          return from(this.showCreateGamePopup(options, invitedId));
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



  // Handle format selection from matchmaking lobby
  onFormatSelected(format: Format): void {
    this.selectedFormat = format;
  }

  // Development method to test reconnection dialog
  public openReconnectionDialog(testType: 'progress' | 'manual' | 'error'): void {
    let dialogData: any = {};

    switch (testType) {
      case 'progress':
        dialogData = {
          gameId: 12345,
          showManualOptions: false
        };
        break;
      case 'manual':
        dialogData = {
          gameId: 12345,
          showManualOptions: true
        };
        break;
      case 'error':
        dialogData = {
          gameId: 12345,
          showManualOptions: true,
          error: 'Connection timeout exceeded'
        };
        break;
    }

    const dialogRef = this.dialog.open(ReconnectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData,
      disableClose: true,
      panelClass: 'reconnection-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Reconnection dialog closed with result:', result);
        switch (result.action) {
          case 'reconnected':
            console.log('Reconnection successful');
            break;
          case 'return_to_menu':
            console.log('User chose to return to menu');
            break;
        }
      }
    });
  }
}