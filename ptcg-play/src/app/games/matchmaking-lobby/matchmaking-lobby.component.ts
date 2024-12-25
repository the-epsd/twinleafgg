import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype, Format, RankLevel, UserInfo } from 'ptcg-server';
import { Subscription, throwError } from 'rxjs';
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import { DeckListEntry } from 'src/app/api/interfaces/deck.interface';
import { DeckService } from 'src/app/api/services/deck.service';
import { GameService } from 'src/app/api/services/game.service';
import { ArchetypeService } from 'src/app/deck/deck-archetype-service/archetype.service';
import { ArchetypeUtils } from 'src/app/deck/deck-archetype-service/archetype.utils';
import { DeckComponent } from 'src/app/deck/deck.component';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';

interface QueueUpdate {
  format: string;
  players: string[];
}

interface GameStartedUpdate {
  format: string;
  gameId: string;
  players: string[];
}

@Component({
  selector: 'ptcg-matchmaking-lobby',
  templateUrl: './matchmaking-lobby.component.html',
  styleUrls: ['./matchmaking-lobby.component.scss']
})
export class MatchmakingLobbyComponent implements OnInit, OnDestroy {
  formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' }
  ];

  selectedFormat: Format = Format.STANDARD;
  inQueue: boolean = false;
  queuedPlayers: string[] = [];
  decks: DeckListEntry[];
  deckId: number;
  private subscription: Subscription;
  private pollingInterval: any;
  decksByFormat = [];
  public playerRank: RankLevel;
  defaultDeck: DeckListEntry;


  constructor(
    private gameService: GameService,
    private router: Router,
    private deckService: DeckService,
    private cardsBaseService: CardsBaseService,
  ) {
    this.playerRank = this.playerRank;
  }

  getArchetype(deckItems: any[]): Archetype {
    return ArchetypeUtils.getArchetype(deckItems);
  }

  getCurrentDeckName(): string {
    return this.decksByFormat.find(deck => deck.id === this.deckId)?.name || '';
  }

  ngOnInit() {
    const defaultDeckId = localStorage.getItem('defaultDeckId');
    if (defaultDeckId) {
      this.deckService.getDeck(parseInt(defaultDeckId, 10)).subscribe(
        response => {
          this.defaultDeck = {
            ...response.deck,
            deckItems: response.deck.cards.map(cardName => ({
              card: this.cardsBaseService.getCardByName(cardName),
              count: 1,
              pane: null,
              scanUrl: null
            }))
          };
          this.deckId = response.deck.id;
        }
      );
    } else {
      // If no default deck, get regular deck list
      this.deckService.getListByFormat(Format.STANDARD).pipe(
        map(d => d.filter(deck => deck.isValid))
      ).subscribe(decks => {
        this.decksByFormat = decks;
        if (decks.length > 0) {
          this.deckId = decks[0].id;
        }
      });
    }

    this.deckService.getListByFormat(Format.STANDARD).pipe(
      map(d => d.filter(deck => deck.isValid))
    ).subscribe(decks => {
      this.decksByFormat = decks;
      if (decks.length > 0) {
        this.deckId = decks[0].id;
      }
    });
  }
  // private isQueueUpdate(update: any): update is QueueUpdate {
  //   return 'players' in update && Array.isArray(update.players);
  // }

  // private isGameStartedUpdate(update: any): update is GameStartedUpdate {
  //   return 'gameId' in update && typeof update.gameId === 'string';
  // }

  joinQueue() {
    this.inQueue = true;
    this.deckService.getDeck(this.deckId).pipe(
      map(response => response.deck.cards),
      switchMap(cards =>
        this.gameService.joinMatchmakingQueue(this.selectedFormat, cards)
          .pipe(
            retry(3),
            catchError(error => {
              this.inQueue = false;
              console.error('Failed to join queue:', error);
              return throwError(() => error);
            })
          )
      )
    ).subscribe({
      next: () => {
        console.log('Joined queue successfully');
        // this.startPolling();
      },
      error: (error) => console.error('Error joining queue:', error)
    });
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      this.gameService.checkQueueStatus(this.selectedFormat).subscribe(
        status => {
          console.log('Queue status:', status);
          this.queuedPlayers = status.players;
          if (status.gameCreated) {
            this.stopPolling();
            this.router.navigate(['/game', status.gameId]);
          }
        },
        error => console.error('Error checking queue status:', error)
      );
    }, 1000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  ngOnDestroy() {
    this.stopPolling();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.leaveQueue();
  }

  leaveQueue() {
    this.inQueue = false;
    this.gameService.leaveMatchmakingQueue().subscribe(
      () => console.log('Left queue successfully'),
      error => console.error('Error leaving queue:', error)
    );
  }

  onFormatSelected(format: Format) {
    this.deckService.getListByFormat(format).pipe(
      map(d => d.filter(deck => deck.isValid))
    ).subscribe(decks => {
      this.decksByFormat = decks;

      if (decks.length > 0) {
        this.deckId = decks[0].id;
      }
    });

  }
}
