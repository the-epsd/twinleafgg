import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype, Format } from 'ptcg-server';
import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil, map, takeWhile } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SocketService } from '../../api/socket.service';
import { DeckService } from '../../api/services/deck.service';
import { DeckListEntry } from '../../api/interfaces/deck.interface';
import { ArchetypeUtils } from '../../deck/deck-archetype-service/archetype.utils';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckItem } from '../../deck/deck-card/deck-card.interface';
import { MatSnackBar } from '@angular/material/snack-bar';


@UntilDestroy()
@Component({
  selector: 'ptcg-matchmaking-lobby',
  templateUrl: './matchmaking-lobby.component.html',
  styleUrls: ['./matchmaking-lobby.component.scss']
})
export class MatchmakingLobbyComponent implements OnInit, OnDestroy {
  @Output() formatSelected = new EventEmitter<Format>();
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

  public selectedFormat: Format | null = null;
  public deckId: number | null = null;
  public decksByFormat: DeckListEntry[] = [];
  public inQueue = false;
  public queuedPlayers: string[] = [];
  public loading = false;
  public connectionError = false;
  public timeInQueue = 0;
  public defaultDeckId: number | null = null;
  public formatDefaultDecks: { [key: string]: number } = {};
  public formatDecks: { [key: number]: DeckListEntry[] } = {}; // Store decks for each format
  public currentPage = 0; // Track which page of 4 formats we're viewing
  public lastSelectedFormat: Format | null = null; // Store last selected format without auto-selecting
  public isFormatAnimating = false; // Track if format animation is playing
  public hoveredFormat: Format | null = null; // Track which format is being hovered

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

    // Load last selected format from localStorage, but don't auto-select
    const lastFormat = localStorage.getItem('lastSelectedFormat');
    if (lastFormat) {
      // Store the last format but don't select it automatically
      this.lastSelectedFormat = parseInt(lastFormat, 10);
    }

    this.setupSocketListeners();

    // Load decks for the first page of formats
    this.loadVisibleFormatDecks();
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

  // Helper method to get background image for selected format
  getBackgroundImage(): string {
    // Use hovered format if available, otherwise use selected format
    const activeFormat = this.hoveredFormat || this.selectedFormat;

    if (!activeFormat) {
      return 'none';
    }

    // Return specific background for Standard format
    if (activeFormat === Format.STANDARD) {
      return 'url("assets/bg-standard.png")';
    }

    if (activeFormat === Format.STANDARD_NIGHTLY) {
      return 'url("assets/bg-nightly.avif")';
    }

    // You can customize this to return different background images based on format
    // For now, using a generic background
    return 'url("assets/images/backgrounds/format-background.jpg")';
  }

  // Helper method to get deck for a specific format
  getDeckForFormat(format: Format): DeckListEntry | undefined {
    if (!format) return undefined;

    // Get decks for this specific format
    const formatDecks = this.formatDecks[format];
    if (!formatDecks || formatDecks.length === 0) {
      return undefined;
    }

    // Use the same deck selection logic as the main selected format
    const formatDefaultDeckId = this.getFormatDefaultDeckId(format);

    if (formatDefaultDeckId && formatDecks.some(d => d.id === formatDefaultDeckId)) {
      return formatDecks.find(d => d.id === formatDefaultDeckId);
    } else if (formatDecks.length > 0) {
      return formatDecks[0];
    }

    return undefined;
  }

  // Helper method to check if a format has valid decks
  hasValidDeckForFormat(format: Format): boolean {
    return this.getDeckForFormat(format) !== undefined;
  }

  // Helper method to load decks for a specific format
  private loadDecksForFormat(format: Format): void {
    this.deckService.getListByFormat(format).subscribe(
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

        this.formatDecks[format] = decks;
      },
      error => {
        console.error(`Failed to load decks for format ${format}:`, error);
        this.formatDecks[format] = [];
      }
    );
  }

  // Helper method to load decks for adjacent formats
  private loadAdjacentFormatDecks(): void {
    const previousFormat = this.getPreviousFormat();
    const nextFormat = this.getNextFormat();

    if (previousFormat && !this.formatDecks[previousFormat.value]) {
      this.loadDecksForFormat(previousFormat.value);
    }

    if (nextFormat && !this.formatDecks[nextFormat.value]) {
      this.loadDecksForFormat(nextFormat.value);
    }
  }

  public onFormatSelected(format: Format): void {
    if (this.inQueue) {
      this.showErrorMessage('Cannot change format while in queue');
      return;
    }

    // Force animation replay by temporarily clearing the format
    if (this.selectedFormat === format) {
      this.isFormatAnimating = true;
      this.selectedFormat = null;

      // Use setTimeout to ensure the DOM updates before setting the format again
      setTimeout(() => {
        this.selectedFormat = format;
        this.isFormatAnimating = false;
      }, 10);
    } else {
      this.selectedFormat = format;
    }

    this.lastSelectedFormat = format;
    this.formatSelected.emit(format);

    // Store the selected format in localStorage
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
        this.formatDecks[format] = decks; // Store decks for this format

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

        // Load decks for adjacent formats
        this.loadAdjacentFormatDecks();
      },
      error => {
        console.error('Failed to load decks:', error);
        this.loading = false;
        this.showErrorMessage('Failed to load decks');
      }
    );
  }

  public onFormatHover(format: Format | null): void {
    this.hoveredFormat = format;
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

    // Pass artworks selection if available on the deck
    const artworks = (deck as any).artworks as { code: string; artworkId?: number }[] | undefined;
    this.socketService.joinMatchmakingQueue(this.selectedFormat, deck.cards, artworks)
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

  // Helper method to get format icon
  getFormatIcon(format: Format): string {
    const iconMap: { [key: number]: string } = {
      [Format.STANDARD]: 'sports_esports',
      [Format.STANDARD_NIGHTLY]: 'nightlight',
      [Format.GLC]: 'group',
      [Format.EXPANDED]: 'expand',
      [Format.UNLIMITED]: 'all_inclusive',
      [Format.SWSH]: 'sword',
      [Format.SM]: 'sunny',
      [Format.XY]: 'xy',
      [Format.BW]: 'black_white',
      [Format.RSPK]: 'history',
      [Format.RETRO]: 'restore',
    };
    return iconMap[format] || 'casino';
  }

  // Helper method to get format description
  getFormatDescription(format: Format): string {
    const descriptionMap: { [key: number]: string } = {
      [Format.STANDARD]: 'Current Standard Format',
      [Format.STANDARD_NIGHTLY]: 'Nightly Standard Testing',
      [Format.GLC]: 'Gym Leader Challenge',
      [Format.EXPANDED]: 'Expanded Format',
      [Format.UNLIMITED]: 'Unlimited Format',
      [Format.SWSH]: 'Sword & Shield Era',
      [Format.SM]: 'Sun & Moon Era',
      [Format.XY]: 'X & Y Era',
      [Format.BW]: 'Black & White Era',
      [Format.RSPK]: 'RSPK Format',
      [Format.RETRO]: 'Retro Format',
    };
    return descriptionMap[format] || 'Pokemon TCG Format';
  }

  // Helper method to get format label
  getFormatLabel(format: Format): string {
    const formatObj = this.formats.find(f => f.value === format);
    return formatObj ? formatObj.label : 'LABEL_UNKNOWN';
  }

  // Helper method to get previous format
  getPreviousFormat(): { value: Format; label: string } | undefined {
    const currentIndex = this.formats.findIndex(f => f.value === this.selectedFormat);
    if (currentIndex > 0) {
      return this.formats[currentIndex - 1];
    }
    return undefined;
  }

  // Helper method to get next format
  getNextFormat(): { value: Format; label: string } | undefined {
    const currentIndex = this.formats.findIndex(f => f.value === this.selectedFormat);
    if (currentIndex < this.formats.length - 1) {
      return this.formats[currentIndex + 1];
    }
    return undefined;
  }

  // Helper method to get format by index
  getFormatAtIndex(index: number): { value: Format; label: string } | undefined {
    const startIndex = this.currentPage * 4;
    const targetIndex = startIndex + index;

    if (targetIndex >= 0 && targetIndex < this.formats.length) {
      return this.formats[targetIndex];
    }
    return undefined;
  }

  // Navigation methods
  previousFormat(): void {
    if (this.inQueue) return;

    if (this.currentPage > 0) {
      this.currentPage--;

      // Load decks for the newly visible formats
      this.loadVisibleFormatDecks();
    }
  }

  nextFormat(): void {
    if (this.inQueue) return;

    const maxPage = Math.floor((this.formats.length - 1) / 4);
    if (this.currentPage < maxPage) {
      this.currentPage++;

      // Load decks for the newly visible formats
      this.loadVisibleFormatDecks();
    }
  }

  canNavigatePrevious(): boolean {
    if (this.inQueue) return false;
    return this.currentPage > 0;
  }

  canNavigateNext(): boolean {
    if (this.inQueue) return false;
    const maxPage = Math.floor((this.formats.length - 1) / 4);
    return this.currentPage < maxPage;
  }

  // Helper method to get current page info
  getCurrentPageInfo(): { current: number; total: number } {
    const totalPages = Math.ceil(this.formats.length / 4);
    return { current: this.currentPage + 1, total: totalPages };
  }

  // Helper method to load decks for visible formats
  private loadVisibleFormatDecks(): void {
    // Load decks for the 4 formats currently visible
    for (let i = 0; i < 4; i++) {
      const format = this.getFormatAtIndex(i);
      if (format && !this.formatDecks[format.value]) {
        this.loadDecksForFormat(format.value);
      }
    }
  }
}
