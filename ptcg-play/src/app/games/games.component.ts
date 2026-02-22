import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GameInfo } from 'ptcg-server';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable, EMPTY, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { CreateGamePopupComponent, CreateGamePopupResult } from './create-game-popup/create-game-popup.component';
import { DeckService } from '../api/services/deck.service';
import { MainService } from '../api/services/main.service';
import { SelectPopupOption } from '../shared/alert/select-popup/select-popup.component';
import { SessionService } from '../shared/session/session.service';
import { Deck, DeckListEntry } from '../api/interfaces/deck.interface';
import { MatchmakingLobbyComponent } from './matchmaking-lobby/matchmaking-lobby.component';
import { ProfileService } from '../api/services/profile.service';
import { GameService } from '../api/services/game.service';
import { FriendsService } from '../api/services/friends.service';
import { Format } from 'ptcg-server';
import { ReconnectionDialogComponent } from '../shared/components/reconnection-dialog/reconnection-dialog.component';
import { ToolbarService } from '../shared/services/toolbar.service';

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
  public games$: Observable<GameInfo[]>;
  public loading = false;
  public lobbyComponent = MatchmakingLobbyComponent;
  public selectedFormat: Format | null = null;
  public isDevelopmentMode = true; // Set to false in production
  public sidebarOpen = false;

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
    private friendsService: FriendsService,
    private toolbarService: ToolbarService
  ) {
    this.games$ = this.sessionService.get(session => session.games);
  }

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Component cleanup
  }

  public toggleSidebar(): void {
    // Close toolbar menu if it's open
    this.toolbarService.closeMenu();
    this.sidebarOpen = !this.sidebarOpen;
  }

  public closeSidebar(): void {
    this.sidebarOpen = false;
  }

  private showCreateGamePopup(decks: SelectPopupOption<DeckListEntry>[], invitedUserId?: number): Promise<CreateGamePopupResult> {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      width: '75vw',
      maxWidth: 'none',
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
          // Close the sidebar when the user confirms the invite (result is not undefined)
          if (result !== undefined) {
            this.closeSidebar();
          }
          return result !== undefined
            ? this.deckService.getDeck(result.deckId).pipe(map(deckResult => ({
              deck: deckResult.deck.cards,
              gameSettings: result.gameSettings,
              deckId: result.deckId,
              sleeveImagePath: deckResult.deck.sleeveImagePath
            })))
            : EMPTY;
        }),
        switchMap(data => {
          return this.mainSevice.createGame(data.deck, data.gameSettings, invitedId, data.deckId, data.sleeveImagePath);
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
        switch (result.action) {
          case 'reconnected':
            break;
          case 'return_to_menu':
            break;
        }
      }
    });
  }
}