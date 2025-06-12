import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { SelectOptionPrompt } from 'ptcg-server';

@Component({
  selector: 'ptcg-prompt-select-option',
  templateUrl: './prompt-select-option.component.html',
  styleUrls: ['./prompt-select-option.component.scss']
})
export class PromptSelectOptionComponent {

  @Input() set prompt(prompt: SelectOptionPrompt) {
    this.promptId = prompt.id;
    this.message = prompt.message;
    this.options = prompt.values.map(value => {
      return this.translate.instant(value);
    });
    this.allowCancel = prompt.options.allowCancel;
    this.disabled = prompt.options.disabled || [];
    this.result = -1;
  }

  @Input() gameState: LocalGameState;

  private promptId: number;
  public message: string;
  public allowCancel: boolean;
  public options: string[];
  public disabled: boolean[];
  public result = -1;

  constructor(
    private gameService: GameService,
    private translate: TranslateService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public selectOption(index: number) {
    this.result = index;
    this.confirm();
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  private confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, this.result);
  }
} 