import { Component, Input, ElementRef } from '@angular/core';
import { CardTarget, SlotType, StateLog, StateLogParam, Player, PlayerType } from 'ptcg-server';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

@Component({
  selector: 'ptcg-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TranslateModule
  ]
})
export class GameLogsComponent {

  private readonly LOG_COUNT_LIMIT = 50;

  public loading = true;
  public logs: GameLog[] = [];
  public message = '';
  public isDeleted: boolean;
  private state: LocalGameState;

  @Input() set gameState(gameState: LocalGameState) {
    if (!gameState || !gameState.state) {
      this.logs = [];
      return;
    }
    if (this.state && this.state.localId !== gameState.localId) {
      this.logs = [];
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
          this.gameService.playCardAction(this.state.gameId, cardId, cardName);
        }
      }
    }


  }

  public trackByFn(log: GameLog) {
    return log.id;
  }

  private appendLogs(logs: StateLog[]) {
    if (logs.length === 0 || !this.state) {
      return;
    }

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

    // Remove logs over the limit
    if (this.logs.length > this.LOG_COUNT_LIMIT) {
      const toDelete = this.logs.length - this.LOG_COUNT_LIMIT;
      this.logs.splice(0, toDelete);
    }

    this.scrollToBottom();
  }

  private buildGameLog(log: StateLog): GameLog | undefined {
    let name: string;
    let className: string;
    const timestamp = String(log.params?.['timestamp'] || '');

    const client = this.sessionService.session.clients.find(c => c.clientId === log.client);
    const user = client ? this.sessionService.session.users[client.userId] : undefined;
    const playerIndex = this.state.state.players.findIndex(p => p.id === log.client);
    const activePlayerId = this.state.state.activePlayer;
    const activePlayer = this.state.state.players.find(p => p.id === activePlayerId);

    if (log.params?.['private'] === 'true' && log.client !== this.sessionService.session.users[log.client]?.userId) {
      return undefined;
    }

    if (user !== undefined) {
      name = user.name;
      if (activePlayer && log.client === activePlayer.id) {
        className = 'ptcg-player-active'; // Active player (you)
      } else {
        className = 'ptcg-player-opponent'; // Opponent
      }
    } else {
      name = 'System';
      className = 'ptcg-player-system';
    }

    return {
      id: log.id,
      name,
      className,
      message: log.message,
      params: log.params,
      timestamp
    };
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
      const scollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-game-logs-content')[0] as HTMLElement;
      setTimeout(() => {
        scollablePane.scrollTop = scollablePane.scrollHeight;
      });
    } catch (err) { }
  }
}