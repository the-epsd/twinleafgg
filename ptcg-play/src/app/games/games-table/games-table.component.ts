import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameInfo, UserInfo } from 'ptcg-server';
import { Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, takeUntil, debounceTime, filter, switchMap, startWith } from 'rxjs/operators';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-games-table',
  templateUrl: './games-table.component.html',
  styleUrls: ['./games-table.component.scss']
})
export class GamesTableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['id', 'player1', 'player2', 'prizes', 'turn', 'actions'];
  public games$: Observable<{ game: GameInfo, users: UserInfo[] }[]>;

  private destroy$ = new Subject<void>();
  private lastStableData: { game: GameInfo, users: UserInfo[] }[] = [];

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    // Create separate observables for each piece of data
    const games$ = this.sessionService.get(session => session.games);
    const clients$ = this.sessionService.get(session => session.clients);
    const users$ = this.sessionService.get(session => session.users);

    // Create a more robust observable that handles reconnection timing
    this.games$ = combineLatest([games$, clients$, users$]).pipe(
      // Start with empty arrays to handle initial state
      startWith([[], [], {}]),
      // Filter out completely empty data
      filter(([games, clients, users]) =>
        games && clients && users &&
        Array.isArray(games) && Array.isArray(clients) && typeof users === 'object'
      ),
      // Map the data
      map(([games, clients, users]) => {
        if (!games || games.length === 0) {
          return this.lastStableData; // Return last stable data if no games
        }

        const mappedGames = games.map(game => {
          const gameUsers = game.players.map(player => {
            const client = clients.find(c => c.clientId === player.clientId);
            return client ? users[client.userId] : undefined;
          }).filter(user => user !== undefined);

          return { game, users: gameUsers };
        });

        // Only update if we have valid data
        if (mappedGames.length > 0 && mappedGames.every(item => item.users.length > 0)) {
          this.lastStableData = mappedGames;
        }

        return this.lastStableData;
      }),
      // Debounce to prevent rapid updates during reconnection
      debounceTime(200),
      // Custom comparison to ensure stable references
      distinctUntilChanged((prev, curr) => {
        if (!prev || !curr || prev.length !== curr.length) {
          return false;
        }

        return prev.every((item, index) => {
          const currItem = curr[index];
          if (!currItem) return false;

          return item.game.gameId === currItem.game.gameId &&
            item.users.length === currItem.users.length &&
            item.users.every((user, userIndex) => {
              const currUser = currItem.users[userIndex];
              return user && currUser && user.userId === currUser.userId;
            });
        });
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
