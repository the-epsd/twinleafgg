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
  public formats = [
    { value: Format.STANDARD, label: 'Standard' },
    { value: Format.STANDARD_NIGHTLY, label: 'Standard Nightly' },
    { value: Format.EXPANDED, label: 'Expanded' },
    { value: Format.GLC, label: 'GLC' },
    { value: Format.RETRO, label: 'Retro' },
    { value: Format.UNLIMITED, label: 'Unlimited' },
  ];

  public selectedFormat: Format = Format.STANDARD;
  public deckId: number | null = null;
  public decksByFormat: DeckListEntry[] = [];
  public inQueue = false;
  public queuedPlayers: string[] = [];
  public loading = false;
  public connectionError = false;
  public timeInQueue = 0;

  private queueTimeout: any;
  private cooldownInterval: any;
  private queueTimerInterval: any;
  private readonly MAX_QUEUE_TIME = 300; // 5 minutes
  public onCooldown = false;
  public cooldownSeconds = 0;
  private readonly COOLDOWN_DURATION = 3; // 3 seconds cooldown
  private destroy$ = new Subject<void>();

  private subscriptions: Subscription[] = [];

  constructor(
    private deckService: DeckService,
    private socketService: SocketService,
    private router: Router,
    private cardsBaseService: CardsBaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    this.timeInQueue = 0;
    this.queuedPlayers = [];
  }

  private setupSocketListeners(): void {
    // Setup queue update listener
    this.socketService.on('matchmaking:queueUpdate', (data: { players: string[] }) => {
      console.log('Queue update received:', data.players);
      this.queuedPlayers = data.players;
    });

    // Listen for game creation
    this.socketService.on('matchmaking:gameCreated', (data: { gameId: number }) => {
      console.log('Game created, ID:', data.gameId);
      if (this.inQueue) {
        this.resetQueueState();
        this.router.navigate(['/table', data.gameId]);
      }
    });
  }

  private loadDefaultDeck(): void {
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      const defaultId = parseInt(savedDefaultDeckId, 10);
      // Only set the deck if it exists in the current format's deck list
      const deck = this.decksByFormat.find(d => d.id === defaultId);
      if (deck) {
        this.deckId = defaultId;
      } else {
        this.deckId = null;
      }
    }
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
        const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
        if (savedDefaultDeckId) {
          const defaultId = parseInt(savedDefaultDeckId, 10);
          if (this.decksByFormat.some(d => d.id === defaultId)) {
            this.deckId = defaultId;
          } else {
            this.deckId = null;
          }
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

  private loadDecks(): void {
    this.deckService.getListByFormat(this.selectedFormat).subscribe(
      decks => {
        this.decksByFormat = decks;
        if (!this.decksByFormat.find(d => d.id === this.deckId)) {
          this.deckId = null;
        }
      }
    );
  }

  public joinQueue(): void {
    if (!this.deckId || this.onCooldown || this.loading || this.connectionError) return;

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

    this.socketService.joinMatchmakingQueue(this.selectedFormat, deck.cards)
      .subscribe(
        () => {
          this.loading = false;
          this.inQueue = true;
          this.timeInQueue = 0;
          console.log('Joined matchmaking queue');

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
          console.error('Failed to join queue:', error);
          this.inQueue = false;
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
    if (!this.inQueue) return;

    this.loading = true;

    this.socketService.leaveMatchmakingQueue()
      .subscribe(
        () => {
          this.loading = false;
          this.resetQueueState();
          // Start cooldown countdown
          this.startCooldown();
          console.log('Left matchmaking queue');
        },
        (error) => {
          this.loading = false;
          console.error('Failed to leave queue:', error);
          // Even if the server failed to process the leave request,
          // we reset the client state
          this.resetQueueState();
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
  getArchetype(deckItems: any[]): Archetype {
    if (!deckItems) return Archetype.UNOWN;
    return ArchetypeUtils.getArchetype(deckItems);
  }
}
