import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype, Format } from 'ptcg-server';
import { Subscription } from 'rxjs';
import { filter, takeUntil, map, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketService } from '../../api/socket.service';
import { DeckService } from '../../api/services/deck.service';
import { DeckListEntry } from '../../api/interfaces/deck.interface';
import { ArchetypeUtils } from '../../deck/deck-archetype-service/archetype.utils';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckItem } from '../../deck/deck-card/deck-card.interface';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'ptcg-matchmaking-lobby',
  templateUrl: './matchmaking-lobby.component.html',
  styleUrls: ['./matchmaking-lobby.component.scss']
})
export class MatchmakingLobbyComponent implements OnInit, OnDestroy {
  // Make Format enum available to the template
  public Format = Format;

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
  ];

  public selectedFormat: Format = Format.STANDARD;
  public deckId: number | null = null;
  public decksByFormat: DeckListEntry[] = [];
  public inQueue = false;
  public queuedPlayers: string[] = [];
  public loading = false;
  public connectionError = false;
  public timeInQueue = 0;
  public defaultDeckId: number | null = null;
  public formatDefaultDecks: { [key: string]: number } = {};

  private queueTimeout: ReturnType<typeof setTimeout> | null = null;
  private cooldownInterval: ReturnType<typeof setInterval> | null = null;
  private queueTimerInterval: ReturnType<typeof setInterval> | null = null;
  private readonly MAX_QUEUE_TIME = 300; // 5 minutes
  public onCooldown = false;
  public cooldownSeconds = 0;
  private readonly COOLDOWN_DURATION = 3; // 3 seconds cooldown
  private destroy$ = new Subject<void>();

  private joinLeaveDebounce = false;

  constructor(
    private deckService: DeckService,
    private socketService: SocketService,
    private router: Router,
    private cardsBaseService: CardsBaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Load global default deck
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      this.defaultDeckId = parseInt(savedDefaultDeckId, 10);
    }

    // Load format-specific default decks
    const savedFormatDefaults = localStorage.getItem('formatDefaultDecks');
    if (savedFormatDefaults) {
      this.formatDefaultDecks = JSON.parse(savedFormatDefaults);
    }

    // Monitor socket connection status
    this.socketService.connection
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        if (!connected && this.inQueue) {
          // Handle socket disconnection while in queue
          console.warn('Socket disconnected while in matchmaking queue');
          this.connectionError = true;
          this.resetQueueState();
          this.showErrorMessage('Connection lost. Please try again.');
        } else if (connected && this.connectionError) {
          // Connection restored
          this.connectionError = false;
        }
      });

    // Load last selected format from localStorage
    const lastFormat = localStorage.getItem('lastSelectedFormat');
    if (lastFormat) {
      this.selectedFormat = parseInt(lastFormat, 10);
    }

    // Then load decks with the selected format
    this.onFormatSelected(this.selectedFormat);
    this.setupSocketListeners();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
    if (this.inQueue) {
      this.leaveQueueSilently();
    }
    this.socketService.off('matchmaking:queueUpdate');
    this.socketService.off('matchmaking:gameCreated');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private clearAllTimers(): void {
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout);
      this.queueTimeout = null;
    }
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
      this.cooldownInterval = null;
    }
    if (this.queueTimerInterval) {
      clearInterval(this.queueTimerInterval);
      this.queueTimerInterval = null;
    }
  }

  private resetQueueState(): void {
    this.clearAllTimers();
    this.inQueue = false;
    this.loading = false;
    this.timeInQueue = 0;
    this.queuedPlayers = [];
    this.joinLeaveDebounce = false;
  }

  private setupSocketListeners(): void {
    // Setup queue update listener
    this.socketService.on('matchmaking:queueUpdate', (data: { players: string[] }) => {
      this.queuedPlayers = data.players;
    });

    // Listen for game creation
    this.socketService.on('matchmaking:gameCreated', (data: { gameId: number }) => {
      console.log(`[Matchmaking] Received gameCreated event for game ${data.gameId}`);
      if (this.inQueue) {
        console.log(`[Matchmaking] Navigating to game ${data.gameId}`);
        this.resetQueueState();
        this.router.navigate(['/table', data.gameId]);
      } else {
        console.log(`[Matchmaking] Received gameCreated but not in queue`);
      }
    });
  }

  // Get the preferred deck for the current format
  private getFormatDefaultDeckId(format: Format): number | null {
    const formatKey = Format[format].toLowerCase();

    if (this.formatDefaultDecks[formatKey]) {
      return this.formatDefaultDecks[formatKey];
    }

    return this.defaultDeckId;
  }

  public onFormatSelected(format: Format): void {
    if (this.inQueue) {
      this.showErrorMessage('Cannot change format while in queue');
      return;
    }

    this.selectedFormat = format;
    // Save selected format to localStorage
    localStorage.setItem('lastSelectedFormat', format.toString());

    this.loading = true;

    this.deckService.getListByFormat(this.selectedFormat).subscribe(
      decks => {
        // Process deck items like in deck component
        decks.forEach(deck => {
          const deckCards: DeckItem[] = [];
          deck.cards.forEach(card => {
            deckCards.push({
              card: this.cardsBaseService.getCardByName(card),
              count: 0,
              pane: null,
              scanUrl: null
            });
          });
          deck.deckItems = deckCards;
        });

        this.decksByFormat = decks;

        // Get format-specific default deck
        const formatDefaultDeckId = this.getFormatDefaultDeckId(this.selectedFormat);

        // Check if the default deck for this format is available in the current deck list
        if (formatDefaultDeckId && this.decksByFormat.some(d => d.id === formatDefaultDeckId)) {
          this.deckId = formatDefaultDeckId;
        } else if (this.decksByFormat.length > 0) {
          // If no default for this format, use the first valid deck
          this.deckId = this.decksByFormat[0].id;
        } else {
          this.deckId = null;
        }

        this.loading = false;
      },
      error => {
        console.error('Failed to load decks:', error);
        this.loading = false;
        this.showErrorMessage('Failed to load decks');
      }
    );
  }

  public joinQueue(): void {
    if (!this.deckId || this.onCooldown || this.loading || this.connectionError || this.joinLeaveDebounce) return;

    if (!this.socketService.isConnected) {
      this.showErrorMessage('Not connected to server');
      return;
    }

    const deck = this.decksByFormat.find(d => d.id === this.deckId);
    if (!deck) {
      this.showErrorMessage('Invalid deck selection');
      return;
    }

    this.loading = true;
    this.joinLeaveDebounce = true;

    this.socketService.joinMatchmakingQueue(this.selectedFormat, deck.cards)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.loading = false;
          this.inQueue = true;
          this.timeInQueue = 0;
          this.joinLeaveDebounce = false;

          // Start queue timer
          this.startQueueTimer();

          // Set timeout for maximum queue time (5 minutes)
          this.queueTimeout = setTimeout(() => {
            if (this.inQueue) {
              this.leaveQueue();
              this.showErrorMessage('No match found after 5 minutes');
            }
          }, this.MAX_QUEUE_TIME * 1000);
        },
        (error) => {
          this.loading = false;
          this.inQueue = false;
          this.joinLeaveDebounce = false;
          console.error('Failed to join queue:', error);
          this.showErrorMessage('Failed to join matchmaking queue');
        }
      );
  }

  private startQueueTimer(): void {
    this.queueTimerInterval = setInterval(() => {
      this.timeInQueue++;
      if (this.timeInQueue >= this.MAX_QUEUE_TIME) {
        this.leaveQueue();
      }
    }, 1000);
  }

  public getQueueTimeDisplay(): string {
    const minutes = Math.floor(this.timeInQueue / 60);
    const seconds = this.timeInQueue % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  public leaveQueue(): void {
    if (!this.inQueue || this.joinLeaveDebounce) return;

    this.loading = true;
    this.joinLeaveDebounce = true;

    this.socketService.leaveMatchmakingQueue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.loading = false;
          this.resetQueueState();
          // Start cooldown countdown
          this.startCooldown();
          this.joinLeaveDebounce = false;
        },
        (error) => {
          this.loading = false;
          this.resetQueueState();
          this.joinLeaveDebounce = false;
          // Even if the server failed to process the leave request,
          // we reset the client state
          this.showErrorMessage('Failed to leave matchmaking queue');
        }
      );
  }

  private leaveQueueSilently(): void {
    // Used when component is destroyed, doesn't update UI
    this.socketService.leaveMatchmakingQueue().subscribe(
      () => console.log('Successfully left queue on component destroy'),
      (error) => console.error('Error leaving queue on component destroy:', error)
    );
  }

  private startCooldown(): void {
    this.onCooldown = true;
    this.cooldownSeconds = this.COOLDOWN_DURATION;

    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      this.cooldownSeconds--;
      if (this.cooldownSeconds <= 0) {
        clearInterval(this.cooldownInterval);
        this.onCooldown = false;
      }
    }, 1000);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  // Add getter for selected deck
  get selectedDeck(): DeckListEntry | undefined {
    return this.decksByFormat.find(d => d.id === this.deckId);
  }

  // Add the getArchetype method
  getArchetype(deck: DeckListEntry, returnSingle: boolean = false): Archetype | Archetype[] {
    if (!deck) return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];

    // If manual archetypes are set, use those
    if (deck.manualArchetype1 || deck.manualArchetype2) {
      const archetypes = [];
      if (deck.manualArchetype1) archetypes.push(deck.manualArchetype1);
      if (deck.manualArchetype2) archetypes.push(deck.manualArchetype2);
      return returnSingle ? archetypes[0] : archetypes;
    }

    // Otherwise use auto-detection
    return ArchetypeUtils.getArchetype(deck.deckItems, returnSingle);
  }
}
