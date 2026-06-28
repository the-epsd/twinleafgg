import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameInfo, UserInfo, GamePhase, isActiveListGameInfo } from 'ptcg-server';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, takeUntil, debounceTime, filter } from 'rxjs/operators';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-games-table',
  templateUrl: './games-table.component.html',
  styleUrls: ['./games-table.component.scss']
})
export class GamesTableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['id', 'player1', 'player2', 'prizes', 'turn', 'actions'];
  public games$: Observable<{ game: GameInfo, users: (UserInfo | undefined)[] }[]>;
  public GamePhase = GamePhase;

  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    const games$ = this.sessionService.get(session => session.games);
    const clients$ = this.sessionService.get(session => session.clients);
    const users$ = this.sessionService.get(session => session.users);

    this.games$ = combineLatest([games$, clients$, users$]).pipe(
      filter(([games, clients, users]) =>
        games && clients && users &&
        Array.isArray(games) && Array.isArray(clients) && typeof users === 'object'
      ),
      map(([games, clients, users]) => {
        return games
          .filter(isActiveListGameInfo)
          .map(game => {
            const gameUsers = game.players.map((player, index) => {
              const client = clients.find(c => c.clientId === player.clientId);
              if (client && users[client.userId]) {
                return users[client.userId];
              }
              const userId = game.playerUserIds?.[index];
              if (userId !== undefined && users[userId]) {
                return users[userId];
              }
              return undefined;
            });
            return { game, users: gameUsers };
          });
      }),
      debounceTime(200),
      distinctUntilChanged((prev, curr) => {
        if (!prev || !curr || prev.length !== curr.length) {
          return false;
        }

        return prev.every((item, index) => {
          const currItem = curr[index];
          if (!currItem) {
            return false;
          }

          return item.game.gameId === currItem.game.gameId &&
            item.game.turn === currItem.game.turn &&
            item.game.phase === currItem.game.phase &&
            item.users.length === currItem.users.length &&
            item.users.every((user, userIndex) => {
              const currUser = currItem.users[userIndex];
              if (!user && !currUser) {
                return true;
              }
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

  public phaseLabel(phase: GamePhase): string {
    return GamePhase[phase] ?? 'UNKNOWN';
  }

}
