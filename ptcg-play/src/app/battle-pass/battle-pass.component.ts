import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BattlePassService } from './battle-pass.service';
import { BattlePassReward, BattlePassSeason, BattlePassProgress } from './battle-pass.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin } from 'rxjs';

interface BattlePassLevel {
  level: number;
  freeReward?: BattlePassReward;
  premiumReward?: BattlePassReward;
}

@UntilDestroy()
@Component({
  selector: 'app-battle-pass',
  templateUrl: './battle-pass.component.html',
  styleUrls: ['./battle-pass.component.scss']
})
export class BattlePassComponent implements OnInit {

  @ViewChild('rewardsTrackContainer') rewardsTrackContainer: ElementRef;

  public season: BattlePassSeason | undefined;
  public progress: BattlePassProgress | undefined;
  public levels: BattlePassLevel[] = [];
  public isPremium = false;
  public loading = true;
  public claimingLevel: number | null = null;

  constructor(private battlePassService: BattlePassService) { }

  ngOnInit(): void {
    forkJoin({
      seasonData: this.battlePassService.getCurrentSeason(),
      progressData: this.battlePassService.getProgress()
    })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ seasonData, progressData }) => {
          this.season = seasonData.season;
          this.isPremium = progressData.progress.isPremium;
          this.progress = progressData.progress;
          this.levels = this.groupRewardsByLevel(seasonData.season.rewards);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private groupRewardsByLevel(rewards: BattlePassReward[]): BattlePassLevel[] {
    const levelMap = new Map<number, BattlePassLevel>();

    for (const reward of rewards) {
      if (!levelMap.has(reward.level)) {
        levelMap.set(reward.level, { level: reward.level });
      }

      const level = levelMap.get(reward.level)!;
      if (reward.isPremium) {
        level.premiumReward = reward;
      } else {
        level.freeReward = reward;
      }
    }

    // Sort by level and return
    return Array.from(levelMap.values()).sort((a, b) => a.level - b.level);
  }

  public isClaimable(level: number): boolean {
    if (!this.progress || this.claimingLevel === level) {
      return false;
    }
    const isLevelReached = this.progress.level >= level;
    const isClaimed = this.progress.claimedRewards.includes(level);
    return isLevelReached && !isClaimed;
  }

  public claim(level: number): void {
    if (this.claimingLevel || (this.progress && this.progress.claimedRewards.includes(level))) {
      return; // Already claiming or already claimed
    }

    this.claimingLevel = level;
    this.battlePassService.claimReward(level)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          if (this.progress) {
            this.progress.claimedRewards.push(level);
          }
          this.claimingLevel = null;
        },
        error: (err) => {
          console.error(`Failed to claim reward for level ${level}`, err);
          this.claimingLevel = null;
          // Optionally show an error message to the user
        }
      });
  }

  public getExpPercentage(): number {
    if (!this.progress) {
      return 0;
    }
    const currentLevelExp = this.getCurrentLevelExp();
    const totalLevelExp = this.getTotalLevelExp();
    if (totalLevelExp === 0) {
      return 0;
    }
    return (currentLevelExp / totalLevelExp) * 100;
  }

  public getCurrentLevelExp(): number {
    if (!this.progress) return 0;
    return this.progress.exp - this.progress.totalXpForCurrentLevel;
  }

  public getTotalLevelExp(): number {
    if (!this.progress) return 0;
    return this.progress.nextLevelXp;
  }

  public addDebugExp(): void {
    this.battlePassService.addDebugExp(100)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          // Refresh progress to get new level and xp
          this.battlePassService.getProgress()
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (progressData) => {
                this.progress = progressData.progress;
              }
            });
        },
        error: (err) => {
          console.error('Failed to add debug exp', err);
        }
      });
  }

  public onWheelScroll(event: WheelEvent): void {
    if (this.rewardsTrackContainer) {
      const container = this.rewardsTrackContainer.nativeElement as HTMLElement;
      container.scrollLeft -= event.deltaY;
      event.preventDefault();
    }
  }

}
