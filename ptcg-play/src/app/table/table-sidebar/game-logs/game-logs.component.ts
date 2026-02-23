import { Component, Input, ElementRef, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CardTarget, SlotType, StateLog, StateLogParam, Player } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';
import { TranslateService } from '@ngx-translate/core';

interface GameLog {
  id: number;
  name: string;
  className: string;
  message: string;
  params: StateLogParam;
  timestamp: string;
}

interface VisibleMessage {
  log: GameLog;
  addedAt: number;
  fadeOutTimer?: any;
  opacity: number;
  state: string;
}

@Component({
  selector: 'ptcg-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('fading', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('visible => fading', animate('500ms ease-out')),
      transition('void => visible', animate('300ms ease-in'))
    ])
  ]
})
export class GameLogsComponent implements OnDestroy {

  public loading = true;
  public logs: GameLog[] = [];
  public message = '';
  public isDeleted: boolean;
  public showScrollToBottom = false;
  private state: LocalGameState;
  
  @Input() overlayMode: boolean = false;
  public visibleMessages: VisibleMessage[] = [];
  private displayedLogIds: Set<number> = new Set();

  @Input() set gameState(gameState: LocalGameState) {
    if (!gameState || !gameState.state) {
      this.logs = [];
      return;
    }
    if (this.state && this.state.localId !== gameState.localId) {
      this.logs = [];
      this.displayedLogIds.clear();
      this.visibleMessages = [];
    }
    this.state = gameState;
    this.isDeleted = gameState.deleted;
    this.appendLogs(gameState.logs);
  }

  constructor(
    private translateService: TranslateService,
    private elementRef: ElementRef<HTMLElement>,
    private gameService: GameService,
    private sessionService: SessionService
  ) { }

  public clearLogs() {
    this.state.logs = [];
    this.logs = [];
  }

  public sendMessage() {
    const message = (this.message || '').trim().replace(/[^\x00-\x7F]/g, '');
    if (!this.state || message.length === 0) {
      return;
    }
    this.gameService.appendLogAction(this.state.gameId, message);
    this.message = '';

    if (message.startsWith('/play')) {
      const args = message.replace('/play', '').trim().split(' ');

      if (args.length >= 2) {
        const cardName = SlotType[args[1].trim().toUpperCase()];
        let cardIdStr = args[0];

        // Make sure cardIdStr is a valid number
        cardIdStr = cardIdStr.replace(/\D/g, '');

        const cardId = parseInt(cardIdStr, 10);

        if (!isNaN(cardId)) {
          this.gameService.playCardAction(this.state.gameId, cardId, cardName).subscribe();
        }
      }
    }


  }

  public onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.showScrollToBottom = !atBottom;
  }

  public onScrollToBottom() {
    this.scrollToBottom();
  }

  public trackByFn(index: number, item: GameLog | VisibleMessage) {
    if ('log' in item) {
      return item.log.id;
    }
    return item.id;
  }

  public trackByVisibleMessage(index: number, item: VisibleMessage) {
    return item.log.id;
  }

  ngOnDestroy() {
    // Clean up all fade-out timers
    this.visibleMessages.forEach(msg => {
      if (msg.fadeOutTimer) {
        clearTimeout(msg.fadeOutTimer);
      }
    });
    this.visibleMessages = [];
  }

  private appendLogs(logs: StateLog[]) {
    if (logs.length === 0 || !this.state) {
      return;
    }

    // Handle overlay mode differently
    if (this.overlayMode) {
      this.appendLogsOverlayMode(logs);
      return;
    }

    let autoScroll = true;
    try {
      const scrollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-game-logs-content')[0] as HTMLElement;
      if (scrollablePane.scrollTop + scrollablePane.clientHeight < scrollablePane.scrollHeight - 10) {
        autoScroll = false;
      }
    } catch (err) { }

    // delete future logs (when user rewind state in replays)
    let maxLogId = 0;
    logs.forEach(log => { maxLogId = Math.max(log.id, maxLogId); });
    this.logs = this.logs.filter(log => log.id <= maxLogId);

    let logsAdded = false;

    // Append logs, skip the existing one
    logs.forEach(log => {
      if (this.logs.find(log2 => log2.id === log.id) === undefined) {
        const gameLog = this.buildGameLog(log);
        if (gameLog !== undefined) {
          this.logs.push(gameLog);
          logsAdded = true;
        }
      }
    });

    if (!logsAdded) {
      return;
    }

    // Sort logs by their id
    this.logs.sort((a, b) => a.id - b.id);

    if (autoScroll) {
      this.scrollToBottom();
    }
  }

  private appendLogsOverlayMode(logs: StateLog[]) {
    // delete future logs (when user rewind state in replays)
    let maxLogId = 0;
    logs.forEach(log => { maxLogId = Math.max(log.id, maxLogId); });
    this.visibleMessages = this.visibleMessages.filter(msg => msg.log.id <= maxLogId);
    // Also remove faded-out log IDs from displayedLogIds if they're beyond maxLogId
    this.displayedLogIds.forEach(logId => {
      if (logId > maxLogId) {
        this.displayedLogIds.delete(logId);
      }
    });

    // Append new logs
    logs.forEach(log => {
      // Check if log is already displayed (either currently visible or previously displayed)
      const isCurrentlyVisible = this.visibleMessages.find(msg => msg.log.id === log.id) !== undefined;
      const hasBeenDisplayed = this.displayedLogIds.has(log.id);
      
      if (!isCurrentlyVisible && !hasBeenDisplayed) {
        const gameLog = this.buildGameLog(log);
        if (gameLog !== undefined) {
          // Mark this log ID as displayed
          this.displayedLogIds.add(log.id);
          
          const visibleMessage: VisibleMessage = {
            log: gameLog,
            addedAt: Date.now(),
            opacity: 1,
            state: 'visible'
          };
          
          // Limit to 3 messages - remove oldest if needed
          if (this.visibleMessages.length >= 3) {
            const oldest = this.visibleMessages.shift();
            if (oldest && oldest.fadeOutTimer) {
              clearTimeout(oldest.fadeOutTimer);
            }
          }
          
          this.visibleMessages.push(visibleMessage);
          
          // Schedule fade-out after 3 seconds
          this.scheduleFadeOut(visibleMessage);
        }
      }
    });
  }

  private scheduleFadeOut(msg: VisibleMessage) {
    if (!msg) {
      return;
    }

    // Clear any existing timer
    if (msg.fadeOutTimer) {
      clearTimeout(msg.fadeOutTimer);
    }

    // Set fade-out timer for 3 seconds
    msg.fadeOutTimer = setTimeout(() => {
      msg.state = 'fading';
      msg.opacity = 0;
      
      // Remove message after fade animation completes (500ms)
      setTimeout(() => {
        const index = this.visibleMessages.indexOf(msg);
        if (index !== -1) {
          this.visibleMessages.splice(index, 1);
        }
      }, 500);
    }, 3000);
  }

  private buildGameLog(log: StateLog): GameLog | undefined {
    let name: string;
    let className: string;
    const timestamp = String(log.params?.timestamp || '');

    const client = this.sessionService.session.clients.find(c => c.clientId === log.client);
    const user = client ? this.sessionService.session.users[client.userId] : undefined;
    const playerIndex = this.state.state.players.findIndex(p => p.id === log.client);
    const activePlayerId = this.state.state.activePlayer;
    const activePlayer = this.state.state.players.find(p => p.id === activePlayerId);

    if (log.params?.private === 'true' && log.client !== this.sessionService.session.users[log.client]?.userId) {
      return undefined;
    }

    if (user !== undefined) {
      name = user.name;
      if (activePlayer && log.client === activePlayer.id) {
        className = 'ptcg-player-active';
      } else {
        className = 'ptcg-player-opponent';
      }
      return {
        id: log.id,
        name,
        className,
        message: log.message,
        params: log.params,
        timestamp
      };
    } else if (log.client === 0) {
      return {
        id: log.id,
        name: 'System',
        className: 'ptcg-system',
        message: log.message,
        params: log.params,
        timestamp
      };
    }
    return undefined;
  }

  copyLogsToClipboard() {
    let formattedLog = 'Setup\n\n';
    let currentTurn = 0;
    let currentPlayer = '';

    this.logs.forEach(log => {
      const logMessage = this.translateService.instant('GAME_LOGS.' + log.message, log.params);
      let logLine = '';

      if (logMessage.startsWith('Turn #')) {
        currentTurn = parseInt(logMessage.split('#')[1]);
        currentPlayer = logMessage.split('-')[1].trim();
        logLine = `\n\nTurn # ${currentTurn} - ${currentPlayer}'s Turn\n\n`;
      } else if (logMessage.includes('drew') && logMessage.includes('cards')) {
        logLine = `- ${logMessage}\n`;
      } else if (logMessage.startsWith('•')) {
        logLine = `   ${logMessage}\n`;
      } else {
        logLine = `${log.name.replace('System', '').trim()} ${logMessage}\n`;
      }

      formattedLog += logLine;
    });

    navigator.clipboard.writeText(formattedLog).then(() => {
      // Optionally, show a success message or snackbar
    });
  }

  private scrollToBottom(): void {
    try {
      const scrollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-game-logs-content')[0] as HTMLElement;
      if (!scrollablePane) {
        return; // Element doesn't exist yet
      }
      setTimeout(() => {
        // Check again inside setTimeout - element might have been removed
        const pane = this.elementRef.nativeElement
          .getElementsByClassName('ptcg-game-logs-content')[0] as HTMLElement;
        if (pane) {
          pane.scrollTop = pane.scrollHeight;
        }
      });
    } catch (err) { }
  }

}
