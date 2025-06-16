import { Component, Input, OnInit } from '@angular/core';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Prompt } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-wait',
  templateUrl: './prompt-wait.component.html',
  styleUrls: ['./prompt-wait.component.scss']
})
export class PromptWaitComponent implements OnInit {
  @Input() gameState: LocalGameState;
  @Input() prompt: Prompt<any>;

  constructor(private gameService: GameService) { }

  get waitMessage(): string | undefined {
    return (this.prompt as any)?.message;
  }

  ngOnInit() {
    const duration = (this.prompt as any)?.duration;
    if (duration) {
      setTimeout(() => {
        this.resolve();
      }, duration);
    }
  }

  resolve() {
    if (this.gameState && this.prompt) {
      this.gameService.resolvePrompt(this.gameState.gameId, this.prompt.id, null);
    }
  }
} 