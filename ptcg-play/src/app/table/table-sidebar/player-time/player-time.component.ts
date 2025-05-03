import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayerStats } from 'ptcg-server';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ptcg-player-time',
  templateUrl: './player-time.component.html',
  styleUrls: ['./player-time.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PlayerTimeComponent implements OnChanges {

  @Input() timeLimit!: number;
  @Input() playerStats!: PlayerStats;

  public disabled!: boolean;
  public value!: number;
  public timeString!: string;

  constructor() { }

  ngOnChanges(): void {
    if (!this.timeLimit || !this.playerStats) {
      this.value = 100;
      this.disabled = true;
      this.timeString = '';
    }

    const timeLeft = this.playerStats.timeLeft;
    this.disabled = !this.playerStats.isTimeRunning;
    this.value = Math.round(1000 * timeLeft / this.timeLimit) / 10;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    this.timeString = String(minutes) + ':' + String(seconds).padStart(2, '0');
  }
}