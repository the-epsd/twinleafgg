import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BattlePassService } from './battle-pass.service';
import { ApiService } from '../api/api.service';
import { BattlePassReward, BattlePassSeason, BattlePassProgress } from './battle-pass.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin } from 'rxjs';

interface BattlePassLevel {
  level: number;
  freeReward?: BattlePassReward;
}

@UntilDestroy()
@Component({
  selector: 'ptcg-battle-pass',
  templateUrl: './battle-pass.component.html',
  styleUrls: ['./battle-pass.component.scss']
})
export class BattlePassComponent implements OnInit {

  @ViewChild('rewardsTrackContainer') rewardsTrackContainer: ElementRef;

  public season: BattlePassSeason | undefined;
  public progress: BattlePassProgress | undefined;
  public levels: BattlePassLevel[] = [];
  public loading = true;
  public claimingLevel: number | null = null;

  constructor(private battlePassService: BattlePassService, private api: ApiService) { }

  ngOnInit(): void {
    forkJoin({
      seasonData: this.battlePassService.getCurrentSeason(),
      progressData: this.battlePassService.getProgress()
    })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ seasonData, progressData }) => {
          this.season = seasonData.season;
          this.progress = progressData.progress;
          this.levels = this.groupRewardsByLevel(seasonData.season.rewards);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  public adminGrant(reward: BattlePassReward | undefined): void {
    if (!reward) return;
    if (reward.type === 'card_artwork') {
      // Upsert artwork and grant to current user
      // Assumes current userId/role are attached by AuthToken middleware
      const artworkId = Number(reward.item);
      if (Number.isFinite(artworkId)) {
        this.api.post('/v1/artworks/admin/grant', { artworkId })
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => { /* no-op */ },
            error: (err) => { }
          });
      }
    }
  }

  private groupRewardsByLevel(rewards: BattlePassReward[]): BattlePassLevel[] {
    const levelMap = new Map<number, BattlePassLevel>();

    for (const reward of rewards) {
      // Hide premium track completely on the client as well
      if (reward && (reward as any).isPremium) { continue; }

      if (!levelMap.has(reward.level)) {
        levelMap.set(reward.level, { level: reward.level });
      }

      const level = levelMap.get(reward.level)!;
      // Assign the non-premium reward for the level
      level.freeReward = reward;
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
