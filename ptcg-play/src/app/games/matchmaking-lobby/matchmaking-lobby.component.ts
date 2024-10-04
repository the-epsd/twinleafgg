import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/api/services/game.service';
import { Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';

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
    { value: 'STANDARD', label: 'LABEL_STANDARD' },
    { value: 'GLC', label: 'LABEL_GLC' },
    { value: 'EXPANDED', label: 'LABEL_EXPANDED' }
  ];
  selectedFormat: string = 'STANDARD';
  inQueue: boolean = false;
  queuedPlayers: string[] = [];
  private subscription: Subscription;
  private pollingInterval: any;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.gameService.getQueueUpdates().subscribe(
      (update: any) => {
        if (Array.isArray(update)) {
          this.queuedPlayers = update;
        } else if (typeof update === 'object' && update !== null && 'players' in update) {
          this.queuedPlayers = update.players;
          if ('gameId' in update) {
            this.router.navigate(['/game', update.gameId]);
          }
        }
      }
    );
  }


  // private isQueueUpdate(update: any): update is QueueUpdate {
  //   return 'players' in update && Array.isArray(update.players);
  // }

  // private isGameStartedUpdate(update: any): update is GameStartedUpdate {
  //   return 'gameId' in update && typeof update.gameId === 'string';
  // }

  joinQueue() {
    this.inQueue = true;
    this.gameService.joinMatchmakingQueue(this.selectedFormat)
      .pipe(
        retry(3),
        catchError(error => {
          this.inQueue = false;
          console.error('Failed to join queue:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          console.log('Joined queue successfully');
          this.startPolling();
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
    }, 5000); // Poll every 5 seconds
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
  }


  leaveQueue() {
    this.inQueue = false;
    this.gameService.leaveMatchmakingQueue();
  }
}
