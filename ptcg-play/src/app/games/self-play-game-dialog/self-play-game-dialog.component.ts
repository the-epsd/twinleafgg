import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Format, GameSettings, GameState } from 'ptcg-server';
import { forkJoin, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiError } from '../../api/api.error';
import { DeckListEntry } from '../../api/interfaces/deck.interface';
import { DeckService } from '../../api/services/deck.service';
import { GameService } from '../../api/services/game.service';
import { MainService } from '../../api/services/main.service';
import { AlertService } from '../../shared/alert/alert.service';
import { SessionService } from '../../shared/session/session.service';
import { SelectPopupOption } from '../../shared/alert/select-popup/select-popup.component';
import { FormatValidator } from '../../util/formats-validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-self-play-game-dialog',
  templateUrl: './self-play-game-dialog.component.html',
  styleUrls: [
    '../create-game-popup/create-game-popup.component.scss',
    './self-play-game-dialog.component.scss'
  ]
})
export class SelfPlayGameDialogComponent implements OnInit {

  public settings = new GameSettings();
  public isAdmin = false;
  public loadingDecks = false;
  public submitting = false;
  public error: string | null = null;
  public deckId: number | null = null;
  public secondDeckId: number | null = null;
  public formatValidDecks: SelectPopupOption<number>[] = [];
  public sandboxAllPokemonBasic = false;
  public sandboxAttacksCostNoEnergy = false;
  public sandboxRetreatCostsNoEnergy = false;
  public unlimitedEnergyAttachments = false;

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.ETERNAL, label: 'LABEL_ETERNAL' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.THEME, label: 'FORMAT_THEME' },
  ];

  public timeLimits: SelectPopupOption<number>[] = [
    { value: 0, viewValue: 'GAMES_LIMIT_NO_LIMIT' },
    { value: 600, viewValue: 'GAMES_LIMIT_10_MIN' },
    { value: 900, viewValue: 'GAMES_LIMIT_15_MIN' },
    { value: 1200, viewValue: 'GAMES_LIMIT_20_MIN' },
    { value: 1500, viewValue: 'GAMES_LIMIT_25_MIN' },
    { value: 1800, viewValue: 'GAMES_LIMIT_30_MIN' },
  ];

  private decks: DeckListEntry[] = [];
  private formatDefaultDecks: { [format: string]: number } = {};
  private defaultDeckId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<SelfPlayGameDialogComponent>,
    private deckService: DeckService,
    private mainService: MainService,
    private gameService: GameService,
    private sessionService: SessionService,
    private alertService: AlertService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.settings.format = Format.STANDARD;
    this.settings.timeLimit = 1200;
  }

  ngOnInit() {
    this.loadDefaultDeckPreferences();
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    }).subscribe(isAdmin => {
      this.isAdmin = !!isAdmin;
      this.settings.recordingEnabled = !this.isAdmin;
    });

    this.loadingDecks = true;
    this.deckService.getList({ summary: true })
      .pipe(finalize(() => { this.loadingDecks = false; }))
      .subscribe({
        next: response => {
          this.decks = response.decks || [];
          this.onFormatSelected(this.settings.format);
        },
        error: () => {
          this.error = this.translate.instant('REACT_ERROR_LOAD_DECKS');
          this.decks = [];
          this.formatValidDecks = [];
        }
      });
  }

  public onFormatSelected(format: Format) {
    this.settings.format = format;
    this.formatValidDecks = this.decks
      .filter(deck => deck.format.includes(format) && FormatValidator.isDeckValidForFormat(deck, format))
      .map(deck => ({ value: deck.id, viewValue: deck.name }));

    if (this.formatValidDecks.length === 0) {
      this.deckId = null;
      this.secondDeckId = null;
      return;
    }

    const defaultDeckId = this.getFormatDefaultDeckId(format);
    const defaultExists = this.formatValidDecks.some(deck => deck.value === defaultDeckId);
    const nextId = defaultExists ? defaultDeckId : this.formatValidDecks[0].value;
    this.deckId = nextId;
    this.secondDeckId = nextId;
  }

  public onSandboxModeChange(enabled: boolean) {
    if (!enabled) {
      this.clearSandboxOptions();
    }
  }

  public canSubmit(): boolean {
    return !this.submitting
      && !this.loadingDecks
      && this.deckId != null
      && this.secondDeckId != null;
  }

  public cancel() {
    if (this.submitting) {
      return;
    }
    this.dialogRef.close(false);
  }

  public confirm() {
    if (!this.canSubmit() || this.deckId == null || this.secondDeckId == null) {
      return;
    }
    this.submitting = true;
    this.error = null;

    forkJoin([
      this.deckService.getDeck(this.deckId),
      this.deckService.getDeck(this.secondDeckId)
    ]).pipe(
      switchMap(([first, second]) => {
        const deck1 = first.deck;
        const deck2 = second.deck;
        if (!deck1?.cards?.length || !deck2?.cards?.length) {
          this.error = this.translate.instant('REACT_ERROR_LOAD_DECKS');
          return of(null);
        }
        const gameSettings = this.buildGameSettings();
        return this.mainService.createSelfPlayGame({
          deck: deck1.cards,
          secondDeck: deck2.cards,
          gameSettings,
          deckId: deck1.id,
          secondDeckId: deck2.id,
          sleeveImagePath: deck1.sleeveImagePath,
          secondSleeveImagePath: deck2.sleeveImagePath,
          deckBoxImagePath: deck1.deckBoxImagePath,
          secondDeckBoxImagePath: deck2.deckBoxImagePath,
          coinImagePath: deck1.coinImagePath,
          secondCoinImagePath: deck2.coinImagePath
        }).pipe(
          switchMap(gameState => this.joinAndOpen(gameState))
        );
      }),
      finalize(() => { this.submitting = false; })
    ).subscribe({
      next: opened => {
        if (!opened) {
          return;
        }
        this.alertService.toast(this.translate.instant('REACT_SELF_PLAY_SNACKBAR'));
        this.dialogRef.close(true);
      },
      error: (error: ApiError) => {
        this.error = error?.message || this.translate.instant('REACT_ERROR_CREATE_GAME');
      }
    });
  }

  private joinAndOpen(gameState: GameState) {
    return this.gameService.join(gameState.gameId).pipe(
      map(() => {
        const local = this.sessionService.session.gameStates.find(
          g => g.gameId === gameState.gameId && g.deleted === false
        );
        if (!local) {
          this.error = this.translate.instant('REACT_ERROR_CREATE_GAME');
          return false;
        }
        this.router.navigate(['/table', local.localId]);
        return true;
      })
    );
  }

  private buildGameSettings(): GameSettings {
    const gs = new GameSettings();
    gs.format = this.settings.format;
    gs.timeLimit = this.settings.timeLimit;
    gs.recordingEnabled = this.settings.recordingEnabled;
    gs.sandboxMode = this.isAdmin && this.settings.sandboxMode === true;
    if (gs.sandboxMode) {
      gs.sandboxAllPokemonBasic = this.sandboxAllPokemonBasic;
      gs.sandboxAttacksCostNoEnergy = this.sandboxAttacksCostNoEnergy;
      gs.sandboxRetreatCostsNoEnergy = this.sandboxRetreatCostsNoEnergy;
      gs.rules.unlimitedEnergyAttachments = this.unlimitedEnergyAttachments;
    }
    gs.selfPlay = true;
    return gs;
  }

  private clearSandboxOptions() {
    this.settings.sandboxMode = false;
    this.sandboxAllPokemonBasic = false;
    this.sandboxAttacksCostNoEnergy = false;
    this.sandboxRetreatCostsNoEnergy = false;
    this.unlimitedEnergyAttachments = false;
  }

  private loadDefaultDeckPreferences() {
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      this.defaultDeckId = parseInt(savedDefaultDeckId, 10);
    }
    const savedFormatDefaults = localStorage.getItem('formatDefaultDecks');
    if (savedFormatDefaults) {
      this.formatDefaultDecks = JSON.parse(savedFormatDefaults);
    }
  }

  private getFormatDefaultDeckId(format: Format): number | null {
    const formatKeyMap: { [key: number]: string } = {
      [Format.STANDARD]: 'standard',
      [Format.STANDARD_NIGHTLY]: 'standard_nightly',
      [Format.GLC]: 'glc',
      [Format.EXPANDED]: 'expanded',
      [Format.UNLIMITED]: 'unlimited',
      [Format.ETERNAL]: 'eternal',
      [Format.SWSH]: 'swsh',
      [Format.SM]: 'sm',
      [Format.XY]: 'xy',
      [Format.BW]: 'bw',
      [Format.RSPK]: 'rspk',
      [Format.RETRO]: 'retro',
      [Format.THEME]: 'theme'
    };
    const formatKey = formatKeyMap[format];
    if (formatKey && this.formatDefaultDecks[formatKey]) {
      return this.formatDefaultDecks[formatKey];
    }
    return this.defaultDeckId;
  }
}
