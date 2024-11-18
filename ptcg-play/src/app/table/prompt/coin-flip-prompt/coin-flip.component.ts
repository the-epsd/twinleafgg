import { Component, OnInit, Input } from "@angular/core";
import { CoinFlipPrompt, GameState } from "ptcg-server";
import { coinFlipAnimation } from "./coin-flip.animations";
import { state } from "@angular/animations";

@Component({
  selector: 'ptcg-coin-flip',
  templateUrl: './coin-flip.component.html',
  styleUrls: ['./coin-flip.component.scss'],
  animations: [coinFlipAnimation]
})

export class CoinFlipComponent {
  flipState: 'front' | 'back' | 'flipping' = 'front';
  private _prompt: CoinFlipPrompt;
  currentCoinImage: string = 'assets/twinleaf-coin.png';

  @Input()
  set prompt(value: CoinFlipPrompt) {
    if (value) {
      this._prompt = value;
      this.flipState = 'flipping';

      // Update image immediately when flip starts
      this.currentCoinImage = value.result ?
        'assets/twinleaf-coin.png' :
        'assets/twinleaf-coin-back.png';

      setTimeout(() => {
        this.flipState = value.result ? 'front' : 'back';
      }, 1500);
    }
  }

  isFlipping = false;
  result: boolean;

  ngOnInit() {
    this.handleCoinFlip();
  }

  get prompt(): CoinFlipPrompt {
    return this._prompt;
  }

  handleCoinFlip() {
    // Only proceed if we have a valid prompt
    if (!this._prompt) {
      return;
    }

    this.isFlipping = true;
    this.flipState = 'flipping';

    let flips = 0;
    const flipInterval = setInterval(() => {
      this.flipState = this.flipState === 'front' ? 'back' : 'front';
      flips++;

      if (flips >= 5) {
        clearInterval(flipInterval);
        this.isFlipping = false;
        // Use the prompt result to determine final state
        this.flipState = this._prompt.result ? 'front' : 'back';
      }
    }, 150);
  }
}

const decodedState = decodeGameState(state as unknown as GameState);
console.log('Decoded game state:', decodedState);

export function decodeGameState(state: GameState) {
  try {
    return JSON.parse(atob(state.stateData));
  } catch (e) {
    console.log('Failed to decode state data:', e);
    return null;
  }
}