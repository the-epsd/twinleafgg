import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';
import { BoardInteractionService, CoinFlipAnimationEvent } from '../../../shared/services/board-interaction.service';

@Component({
  selector: 'ptcg-visual-coin-flip',
  templateUrl: './visual-coin-flip.component.html',
  styleUrls: ['./visual-coin-flip.component.scss'],
  animations: [
    trigger('coinFlip', [
      state('hidden', style({
        opacity: 0,
        transform: 'rotateY(0) rotateX(0deg) scale(0)',
        display: 'none'
      })),
      state('flipping', style({
        opacity: 1,
        transform: 'rotateY(0) rotateX(0deg) scale(1)',
        display: 'block'
      })),
      state('heads', style({
        opacity: 1,
        transform: 'rotateY(0) rotateX(720deg) scale(1)',
        display: 'block'
      })),
      state('tails', style({
        opacity: 1,
        transform: 'rotateY(0) rotateX(900deg) scale(1)',
        display: 'block'
      })),
      transition('hidden => flipping', [
        animate('0.3s ease-out', style({
          opacity: 1,
          transform: 'rotateY(0) rotateX(0deg) scale(1)'
        }))
      ]),
      transition('flipping => heads', [
        animate('1s linear', keyframes([
          style({ transform: 'rotateY(0) rotateX(0deg) scale(1)', offset: 0 }),
          style({ transform: 'rotateY(45deg) rotateX(240deg) scale(1.6)', offset: 0.1 }),
          style({ transform: 'rotateY(-30deg) rotateX(480deg) scale(2)', offset: 0.6 }),
          style({ transform: 'rotateY(0) rotateX(720deg) scale(1)', offset: 1 })
        ]))
      ]),
      transition('flipping => tails', [
        animate('1s linear', keyframes([
          style({ transform: 'rotateY(0) rotateX(0deg) scale(1)', offset: 0 }),
          style({ transform: 'rotateY(45deg) rotateX(300deg) scale(1.6)', offset: 0.1 }),
          style({ transform: 'rotateY(-30deg) rotateX(600deg) scale(2)', offset: 0.6 }),
          style({ transform: 'rotateY(0) rotateX(900deg) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => hidden', [
        animate('0.3s ease-in', style({
          opacity: 0,
          transform: 'rotateY(0) rotateX(0deg) scale(0)'
        }))
      ])
    ]),
    trigger('resultText', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0)',
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)',
        display: 'block'
      })),
      transition('hidden => visible', [
        animate('0.3s ease-out', style({
          opacity: 1,
          transform: 'scale(1)'
        }))
      ]),
      transition('visible => hidden', [
        animate('0.2s ease-in', style({
          opacity: 0,
          transform: 'scale(0)'
        }))
      ])
    ])
  ]
})
export class VisualCoinFlipComponent implements OnInit, OnDestroy {
  coinState: 'hidden' | 'flipping' | 'heads' | 'tails' = 'hidden';
  resultTextState: 'hidden' | 'visible' = 'hidden';
  result: boolean | null = null;
  flipRotation: string = '900deg';
  floorLines = Array(12).fill(0).map((_, i) => i);
  edgeSegments = Array(16).fill(0).map((_, i) => i);
  private subscription: Subscription;
  private cancelSubscription: Subscription;
  private resultTimeout: any;
  private hideTimeout: any;
  private coinHideTimeout: any;

  constructor(private boardInteractionService: BoardInteractionService) { }

  ngOnInit() {
    this.subscription = this.boardInteractionService.coinFlipAnimation$.subscribe(
      (event: CoinFlipAnimationEvent) => {
        this.showCoinFlip(event);
      }
    );

    this.cancelSubscription = this.boardInteractionService.coinFlipCancel$.subscribe(() => {
      this.cancelAnimation();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
    this.clearAllTimeouts();
  }

  private cancelAnimation() {
    this.clearAllTimeouts();
    this.coinState = 'hidden';
    this.resultTextState = 'hidden';
    this.result = null;
  }

  private showCoinFlip(event: CoinFlipAnimationEvent) {
    // Clear any pending timeouts from previous animations
    this.clearAllTimeouts();

    this.result = event.result;
    // Set the flip rotation: 900deg for heads, 720deg for tails
    this.flipRotation = event.result ? '900deg' : '720deg';
    this.coinState = 'flipping';
    this.resultTextState = 'hidden';

    // After flipping animation completes (1s), show result
    this.resultTimeout = setTimeout(() => {
      this.coinState = event.result ? 'heads' : 'tails';
      this.resultTextState = 'visible';
    }, 1000);

    // Hide after total animation duration
    this.hideTimeout = setTimeout(() => {
      this.resultTextState = 'hidden';
      this.coinHideTimeout = setTimeout(() => {
        this.coinState = 'hidden';
        this.result = null;
      }, 200);
    }, 5500);
  }

  private clearAllTimeouts() {
    if (this.resultTimeout) {
      clearTimeout(this.resultTimeout);
      this.resultTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    if (this.coinHideTimeout) {
      clearTimeout(this.coinHideTimeout);
      this.coinHideTimeout = null;
    }
  }

  get resultText(): string {
    return this.result ? 'HEADS' : 'TAILS';
  }

  get resultClass(): string {
    return this.result ? 'heads' : 'tails';
  }
}
