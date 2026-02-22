import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player, GamePhase, Card, Format, GameWinner, ReplayPlayer, PlayerStats } from 'ptcg-server';
import { Observable, from, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { withLatestFrom, switchMap, finalize, tap, map, take } from 'rxjs/operators';
import { ApiError } from '../api/api.error';
import { AlertService } from '../shared/alert/alert.service';
import { DeckService } from '../api/services/deck.service';
import { GameService } from '../api/services/game.service';
import { LocalGameState } from '../shared/session/session.interface';
import { SessionService } from '../shared/session/session.service';
import { CardsBaseService } from '../shared/cards/cards-base.service';
import { BoardInteractionService } from '../shared/services/board-interaction.service';
import { GameOverPrompt } from './prompt/prompt-game-over/game-over.prompt';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SettingsService } from './table-sidebar/settings-dialog/settings.service';
import { Board3dAccessService } from '../shared/services/board3d-access.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public gameState: LocalGameState;
  public gameStates$: Observable<LocalGameState[]>;
  public clientId$: Observable<number>;
  public bottomPlayer: Player;
  public topPlayer: Player;
  public clientId: number;
  public loading: boolean;
  public waiting: boolean;
  public isAdmin: boolean;
  public isTO: boolean;
  private gameId: number;
  public showGameOver = false;
  public gameOverPrompt: GameOverPrompt;
  public canUndoBackend = false;
  public showSandboxPanel = false;
  public sandboxSidebarCollapsed: boolean = false;
  public use3dBoard: boolean = false;
  public webglSupported: boolean = true;
  public has3dBoardAccess: boolean = false;
  public bottomReplayPlayer: ReplayPlayer | undefined;
  public topReplayPlayer: ReplayPlayer | undefined;
  public bottomPlayerStats: PlayerStats | undefined;
  public topPlayerStats: PlayerStats | undefined;
  public isTopPlayerActive: boolean;
  public isBottomPlayerActive: boolean;

  public formats = {
    [Format.STANDARD]: 'LABEL_STANDARD',
    [Format.STANDARD_NIGHTLY]: 'LABEL_STANDARD_NIGHTLY',
    [Format.STANDARD_MAJORS]: 'LABEL_STANDARD_MAJORS',
    [Format.GLC]: 'LABEL_GLC',
    [Format.UNLIMITED]: 'LABEL_UNLIMITED',
    [Format.ETERNAL]: 'LABEL_ETERNAL',
    [Format.EXPANDED]: 'LABEL_EXPANDED',
    [Format.SWSH]: 'LABEL_SWSH',
    [Format.SM]: 'LABEL_SM',
    [Format.XY]: 'LABEL_XY',
    [Format.BW]: 'LABEL_BW',
    [Format.RSPK]: 'LABEL_RSPK',
    [Format.RETRO]: 'LABEL_RETRO',
    [Format.THEME]: 'LABEL_THEME',
  };

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService,
    private cardsBaseService: CardsBaseService,
    private boardInteractionService: BoardInteractionService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private board3dAccessService: Board3dAccessService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
    this.clientId$ = this.sessionService.get(session => session.clientId);
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    }).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 5;
    }).subscribe(isTO => {
      this.isTO = isTO;
    });
  }

  ngOnInit() {
    // Ensure any active board selection is cleared when table initializes
    this.boardInteractionService.endBoardSelection();

    // Check WebGL support
    this.webglSupported = this.checkWebGLSupport();

    // Subscribe to 3D board access status
    this.board3dAccessService.has3dBoardAccess$.pipe(
      untilDestroyed(this)
    ).subscribe(hasAccess => {
      this.has3dBoardAccess = hasAccess;
      // If user loses access, disable 3D board
      if (!hasAccess) {
        this.use3dBoard = false;
      }
    });

    // Read default 3D board setting from SettingsService
    this.settingsService.use3dBoardDefault$.pipe(
      take(1),
      untilDestroyed(this)
    ).subscribe(use3dDefault => {
      // Only use 3D board if WebGL is supported, user has access, and setting is enabled
      this.use3dBoard = this.webglSupported && this.has3dBoardAccess && use3dDefault;
    });

    this.route.paramMap
      .pipe(
        withLatestFrom(this.gameStates$, this.clientId$),
        untilDestroyed(this)
      )
      .subscribe(([paramMap, gameStates, clientId]) => {
        this.gameId = parseInt(paramMap.get('gameId'), 10);
        this.gameState = gameStates.find(state => state.localId === this.gameId);
        // Check if sandbox mode is enabled
        if (this.gameState && this.gameState.state && this.gameState.state.gameSettings) {
          this.showSandboxPanel = this.isAdmin && this.gameState.state.gameSettings.sandboxMode === true;
        } else {
          this.showSandboxPanel = false;
        }

        // Note: We no longer set game ID here when viewing games
        // Game ID should only be set when actively joining as a player, not when spectating

        this.updatePlayers(this.gameState, clientId);
        this.updateCanUndo();
      });

    this.gameStates$
      .pipe(
        untilDestroyed(this),
        withLatestFrom(this.clientId$)
      )
      .subscribe(([gameStates, clientId]) => {
        this.gameState = gameStates.find(state => state.localId === this.gameId);
        // Update sandbox panel visibility
        if (this.gameState && this.gameState.state && this.gameState.state.gameSettings) {
          this.showSandboxPanel = this.isAdmin && this.gameState.state.gameSettings.sandboxMode === true;
        } else {
          this.showSandboxPanel = false;
        }
        this.updatePlayers(this.gameState, clientId);
        this.updateCanUndo();
      });

    // Listen for undoing event
    if (this.gameId) {
      const eventName = `game[${this.gameId}]:undoing`;
      this.gameService.socketService.on(eventName, (data: { playerName: string }) => {
        const myName = this.bottomPlayer?.name || this.topPlayer?.name;
        if (data.playerName && data.playerName !== myName) {
          this.snackBar.open(`${data.playerName} is rewinding their board state`, 'OK', { duration: 3000 });
        }
      });
    }
  }

  ngOnDestroy() {
    // Make sure selection state is cleared when leaving the table view
    this.boardInteractionService.endBoardSelection();

    // Clear game ID when navigating away from the table
    // This prevents reconnection attempts when user is no longer viewing the game
    if (this.gameState && this.gameState.gameId) {
      this.gameService.socketService.clearGameId();
    }
  }

  public play() {
    this.loading = true;
    this.deckService.getListByFormat(this.gameState.format)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
        switchMap(decks => {
          const options = decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => ({ value: deckEntry.id, viewValue: deckEntry.name }));

          if (options.length === 0) {
            this.alertService.alert(
              this.translate.instant('GAMES_NEED_DECK'),
              this.translate.instant('GAMES_NEED_DECK_TITLE')
            );
            return EMPTY;
          }

          return from(this.alertService.select({
            title: this.translate.instant('GAMES_YOUR_DECK_TITLE'),
            message: `${this.translate.instant('GAMES_FORMAT')}: ${this.translate.instant(this.formats[this.gameState.format])}`,
            placeholder: this.translate.instant('GAMES_YOUR_DECK'),
            options,
            value: options[0].value
          }));
        }),
        switchMap(deckId => {
          return deckId !== undefined
            ? this.deckService.getDeck(deckId)
            : EMPTY;
        })
      )
      .subscribe({
        next: deckResponse => {
          const deck = deckResponse.deck.cards;
          this.gameService.play(this.gameState.gameId, deck);
        },
        error: (error: ApiError) => { }
      });
  }

  private updatePlayers(gameState: LocalGameState, clientId: number) {
    this.bottomPlayer = undefined;
    this.topPlayer = undefined;
    this.waiting = false;
    this.clientId = clientId;

    if (!gameState || !gameState.state) {
      this.router.navigate(['/games']);
      return;
    }

    const state = gameState.state;
    if (state.players.length >= 1) {
      if (state.players[0].id === clientId) {
        this.bottomPlayer = state.players[0];
      } else {
        this.topPlayer = state.players[0];
      }
    }

    if (state.players.length >= 2) {
      if (this.bottomPlayer === state.players[0]) {
        this.topPlayer = state.players[1];
      } else {
        this.bottomPlayer = state.players[1];
      }

      if (gameState.switchSide) {
        const tmp = this.topPlayer;
        this.topPlayer = this.bottomPlayer;
        this.bottomPlayer = tmp;
      }

      if (gameState.replay !== undefined) {
        this.clientId = this.bottomPlayer.id;
      }

      const prompts = state.prompts.filter(p => p.result === undefined);

      const isPlaying = state.players.some(p => p.id === this.clientId);
      const isReplay = !!this.gameState.replay;
      const isObserver = isReplay || !isPlaying;
      const waitingForOthers = prompts.some(p => p.playerId !== clientId);
      const waitingForMe = prompts.some(p => p.playerId === clientId);
      const notMyTurn = state.players[state.activePlayer].id !== clientId
        && state.phase === GamePhase.PLAYER_TURN;
      this.waiting = (notMyTurn || waitingForOthers) && !waitingForMe && !isObserver;
    }

    // Update player stats and active states for floating overlays
    this.updatePlayerStatsAndActiveStates(gameState);

    // Do not set any global artworks map; overlays must come from the correct card list context
    this.cardsBaseService.setGlobalArtworksMap({});

    // Check if the game is in the FINISHED phase and update the game over state
    if (state.phase === GamePhase.FINISHED && !gameState.gameOver) {
      this.gameOverPrompt = new GameOverPrompt(clientId, state.winner);
      this.showGameOver = true;
    } else {
      this.showGameOver = false;
    }
  }

  private updatePlayerStatsAndActiveStates(gameState: LocalGameState) {
    if (!gameState || !gameState.state) {
      this.isTopPlayerActive = false;
      this.isBottomPlayerActive = false;
      this.bottomReplayPlayer = undefined;
      this.topReplayPlayer = undefined;
      this.bottomPlayerStats = undefined;
      this.topPlayerStats = undefined;
      return;
    }

    const state = gameState.state;

    // Update active states
    this.isTopPlayerActive = this.isPlayerActive(state, this.topPlayer);
    this.isBottomPlayerActive = this.isPlayerActive(state, this.bottomPlayer);

    // Update player stats
    this.topPlayerStats = this.getPlayerStats(gameState, this.topPlayer);
    this.bottomPlayerStats = this.getPlayerStats(gameState, this.bottomPlayer);

    // Update replay players
    this.bottomReplayPlayer = undefined;
    this.topReplayPlayer = undefined;

    if (gameState.replay !== undefined) {
      this.bottomReplayPlayer = this.isFirstPlayer(state, this.bottomPlayer)
        ? gameState.replay.player1
        : gameState.replay.player2;

      this.topReplayPlayer = this.isFirstPlayer(state, this.topPlayer)
        ? gameState.replay.player1
        : gameState.replay.player2;
    }

    // Refresh player stats if needed
    const topPlayerId = this.topPlayer && this.topPlayer.id;
    const bottomPlayerId = this.bottomPlayer && this.bottomPlayer.id;
    const gameOrPlayerHasChanged = this.gameId !== gameState.localId
      || (this.topPlayerStats && this.topPlayerStats.clientId !== topPlayerId)
      || (this.bottomPlayerStats && this.bottomPlayerStats.clientId !== bottomPlayerId);

    if (!gameState.deleted && gameOrPlayerHasChanged) {
      this.refreshPlayerStats(gameState);
    }
  }

  private isPlayerActive(state: any, player: Player): boolean {
    if (!state || !player || !state.players[state.activePlayer]) {
      return false;
    }
    return player.id === state.players[state.activePlayer].id;
  }

  private isFirstPlayer(state: any, player: Player): boolean {
    if (!state || !player || state.players.length === 0) {
      return false;
    }
    return player.id === state.players[0].id;
  }

  private getPlayerStats(gameState: LocalGameState, player: Player): PlayerStats | undefined {
    if (!player || !gameState.playerStats) {
      return undefined;
    }
    return gameState.playerStats.find(p => p.clientId === player.id);
  }

  private refreshPlayerStats(gameState: LocalGameState) {
    this.gameService.getPlayerStats(gameState.gameId).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: response => {
        const gameStates = this.sessionService.session.gameStates.slice();
        const index = gameStates.findIndex(g => g.localId === gameState.localId);
        if (index !== -1) {
          gameStates[index] = { ...gameStates[index], playerStats: response.playerStats };
          this.sessionService.set({ gameStates });
        }
      }
    });
  }

  private updateCanUndo() {
    if (this.gameId) {
      this.gameService.canUndo(this.gameId).subscribe(canUndo => {
        this.canUndoBackend = canUndo;
      });
    } else {
      this.canUndoBackend = false;
    }
  }

  private updateGameState(state: LocalGameState) {
    this.gameState = state;
    this.updateCanUndo();
    // Show game over screen when the game is finished
    if (state && state.state && state.state.phase === GamePhase.FINISHED && !state.gameOver) {
      this.showGameOver = true;
      this.gameOverPrompt = new GameOverPrompt(this.clientId, state.state.winner);
    } else {
      this.showGameOver = false;
      this.gameOverPrompt = undefined;
    }
    // Update player information
    this.updatePlayers(state, this.clientId);
  }

  public undo() {
    if (this.gameId) {
      this.gameService.undo(this.gameId);
      // Optionally, optimistically set canUndoBackend to false until next state update
      this.canUndoBackend = false;
    }
  }

  toggleSandboxSidebar() {
    this.sandboxSidebarCollapsed = !this.sandboxSidebarCollapsed;
  }

  public toggle3dBoard() {
    // Only allow toggle if user has access
    if (!this.has3dBoardAccess) {
      return;
    }
    this.use3dBoard = !this.use3dBoard;
    this.save3dBoardPreference(this.use3dBoard);
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  private get3dBoardPreference(): boolean {
    const stored = localStorage.getItem('ptcg-use-3d-board');
    return stored === 'true';
  }

  private save3dBoardPreference(use3d: boolean): void {
    localStorage.setItem('ptcg-use-3d-board', use3d.toString());
  }
}
