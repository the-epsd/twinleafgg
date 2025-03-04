import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype, Format } from 'ptcg-server';
import { Subscription } from 'rxjs';
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
  private queueTimeout: any;
  private cooldownInterval: any;
  public onCooldown = false;
  public cooldownSeconds = 0;
  private readonly COOLDOWN_DURATION = 3; // 3 seconds cooldown

  private subscriptions: Subscription[] = [];

  constructor(
    private deckService: DeckService,
    private socketService: SocketService,
    private router: Router,
    private cardsBaseService: CardsBaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout);
    }
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    if (this.inQueue) {
      this.leaveQueue();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupSocketListeners(): void {
    // Setup queue update listener
    this.socketService.on('matchmaking:queueUpdate', (data: { players: string[] }) => {
      this.queuedPlayers = data.players;
    });

    // Listen for game creation
    this.socketService.on('matchmaking:gameCreated', (data: { gameId: number }) => {
      if (this.inQueue) {
        this.inQueue = false;
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
    if (!this.deckId || this.onCooldown) return;

    const deck = this.decksByFormat.find(d => d.id === this.deckId);
    if (!deck) return;

    this.socketService.joinMatchmakingQueue(this.selectedFormat, deck.cards)
      .subscribe(
        () => {
          this.inQueue = true;
          this.queueTimeout = setTimeout(() => {
            if (this.inQueue) {
              this.leaveQueue();
              this.snackBar.open('No match found', '', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
            }
          }, 15000);
        },
        (error) => {
          console.error('Failed to join queue:', error);
          this.inQueue = false;
        }
      );
  }

  public leaveQueue(): void {
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout);
      this.queueTimeout = null;
    }

    this.socketService.leaveMatchmakingQueue()
      .subscribe(
        () => {
          this.inQueue = false;
          this.queuedPlayers = [];
          // Start cooldown countdown
          this.startCooldown();
        },
        (error) => {
          console.error('Failed to leave queue:', error);
        }
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
