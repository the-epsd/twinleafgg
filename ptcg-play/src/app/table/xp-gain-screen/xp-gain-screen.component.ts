import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { XpGainData } from '../../battle-pass/battle-pass.model';

@Component({
  selector: 'ptcg-xp-gain-screen',
  templateUrl: './xp-gain-screen.component.html',
  styleUrls: ['./xp-gain-screen.component.scss'],
  animations: [
    trigger('screenFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('levelUpAnim', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class XpGainScreenComponent implements OnInit {
  @Input() data!: XpGainData;
  @Output() dismiss = new EventEmitter<void>();

  public previousBarPercent = 0;
  public newBarPercent = 0;
  public currentBarPercent = 0;
  public showLevelUp = false;
  private levelUpShown = false;

  ngOnInit(): void {
    this.computeBarPercentages();
    this.currentBarPercent = this.previousBarPercent;
    setTimeout(() => {
      this.currentBarPercent = this.newBarPercent;
    }, 600);
  }

  private computeBarPercentages(): void {
    const d = this.data;
    if (d.xpForPreviousLevel > 0) {
      this.previousBarPercent = Math.min(100, Math.max(0,
        ((d.previousExp - d.totalXpForPreviousLevel) / d.xpForPreviousLevel) * 100
      ));
    }
    if (d.xpForNextLevel > 0) {
      this.newBarPercent = Math.min(100, Math.max(0,
        ((d.newExp - d.totalXpForNewLevel) / d.xpForNextLevel) * 100
      ));
    }
  }

  onBarTransitionEnd(): void {
    if (this.data.leveledUp && !this.levelUpShown) {
      this.levelUpShown = true;
      this.showLevelUp = true;
    }
  }

  onContinueClick(): void {
    this.dismiss.emit();
  }
}
