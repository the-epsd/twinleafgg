import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from '../socket.service';
import { ApiError } from '../api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { GamePhase } from 'ptcg-server';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {

  constructor(
    private socketService: SocketService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  private handleError(error: ApiError) {
    this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
  }

  public modifyPlayer(
    gameId: number,
    targetPlayerId: number,
    modifications: {
      prizes?: number;
      handSize?: number;
      deckSize?: number;
      discardSize?: number;
      lostzoneSize?: number;
      supporterTurn?: number;
      retreatedTurn?: number;
      energyPlayedTurn?: number;
      stadiumPlayedTurn?: number;
      stadiumUsedTurn?: number;
      usedVSTAR?: boolean;
      usedGX?: boolean;
      ancientSupporter?: boolean;
      rocketSupporter?: boolean;
    }
  ): Observable<void> {
    return new Observable<void>(observer => {
      this.socketService.emit('game:sandbox:modifyPlayer', {
        gameId,
        targetPlayerId,
        modifications
      }).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        (error: ApiError) => {
          this.handleError(error);
          observer.error(error);
        }
      );
    });
  }

  public modifyGameState(
    gameId: number,
    modifications: {
      turn?: number;
      phase?: GamePhase;
      activePlayer?: number;
      skipOpponentTurn?: boolean;
      isSuddenDeath?: boolean;
      rules?: {
        firstTurnDrawCard?: boolean;
        firstTurnUseSupporter?: boolean;
        attackFirstTurn?: boolean;
        unlimitedEnergyAttachments?: boolean;
        alternativeSetup?: boolean;
      };
    }
  ): Observable<void> {
    return new Observable<void>(observer => {
      this.socketService.emit('game:sandbox:modifyGameState', {
        gameId,
        modifications
      }).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        (error: ApiError) => {
          this.handleError(error);
          observer.error(error);
        }
      );
    });
  }

  public modifyCard(
    gameId: number,
    targetPlayerId: number,
    action: 'add' | 'remove' | 'move',
    cardName: string,
    fromZone?: string,
    toZone?: string,
    fromIndex?: number,
    toIndex?: number,
    prizeIndex?: number
  ): Observable<void> {
    return new Observable<void>(observer => {
      this.socketService.emit('game:sandbox:modifyCard', {
        gameId,
        targetPlayerId,
        action,
        cardName,
        fromZone,
        toZone,
        fromIndex,
        toIndex,
        prizeIndex
      }).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        (error: ApiError) => {
          this.handleError(error);
          observer.error(error);
        }
      );
    });
  }

  public modifyPokemon(
    gameId: number,
    targetPlayerId: number,
    location: 'active' | 'bench',
    modifications: {
      damage?: number;
      hp?: number;
      energyCount?: number;
      energyTypes?: string[];
      conditions?: {
        burned?: boolean;
        poisoned?: boolean;
        asleep?: boolean;
        paralyzed?: boolean;
        confused?: boolean;
      };
      markers?: { [key: string]: boolean };
    },
    benchIndex?: number
  ): Observable<void> {
    return new Observable<void>(observer => {
      this.socketService.emit('game:sandbox:modifyPokemon', {
        gameId,
        targetPlayerId,
        location,
        modifications,
        benchIndex
      }).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        (error: ApiError) => {
          this.handleError(error);
          observer.error(error);
        }
      );
    });
  }

}

