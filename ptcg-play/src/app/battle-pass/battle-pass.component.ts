import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BattlePassService } from './battle-pass.service';
import { ApiService } from '../api/api.service';
import { BattlePassReward, BattlePassSeason, BattlePassProgress } from './battle-pass.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface BattlePassLevel {
  level: number;
  freeReward?: BattlePassReward;
}

interface SeasonOption {
  seasonId: string;
  name: string;
  startDate: string;
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
  public seasons: SeasonOption[] = [];
  public selectedSeasonId = '';
  public loading = true;
  public switchingSeason = false;
  public noSeasonsAvailable = false;
  public claimingLevel: number | null = null;

  constructor(private battlePassService: BattlePassService, private api: ApiService) { }

  ngOnInit(): void {
    this.battlePassService.getSeasons()
      .pipe(
        untilDestroyed(this),
        switchMap(seasonsRes => {
          this.seasons = seasonsRes.seasons;
          if (this.seasons.length === 0) {
            this.noSeasonsAvailable = true;
            this.loading = false;
            return of(null);
          }
          const defaultId = this.seasons[0]?.seasonId ?? '';
          return this.battlePassService.getActiveSeason().pipe(
            catchError(() => of(null)),
            switchMap(savedId => {
              const isValidSaved = savedId && this.seasons.some(s => s.seasonId === savedId);
              if (isValidSaved) {
                this.selectedSeasonId = savedId;
                return this.loadSeasonData(this.selectedSeasonId);
              }
              return this.battlePassService.getCurrentSeason().pipe(
                map(current => current.season.seasonId),
                catchError(() => of(defaultId))
              ).pipe(
                switchMap(newestId => {
                  this.selectedSeasonId = newestId || defaultId;
                  return this.loadSeasonData(this.selectedSeasonId);
                })
              );
            })
          );
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.season = result.season;
            this.progress = result.progress;
            this.levels = this.groupRewardsByLevel(result.season.rewards);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  public onSeasonChange(): void {
    if (!this.selectedSeasonId) return;
    this.switchingSeason = true;
    this.battlePassService.setActiveSeason(this.selectedSeasonId).pipe(
      untilDestroyed(this),
      catchError(() => of(void 0))
    ).subscribe();
    this.loadSeasonData(this.selectedSeasonId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ season: s, progress: p }) => {
          this.season = s;
          this.progress = p;
          this.levels = this.groupRewardsByLevel(s.rewards);
          this.switchingSeason = false;
        },
        error: () => {
          this.switchingSeason = false;
        }
      });
  }

  private loadSeasonData(seasonId: string) {
    return forkJoin({
      seasonData: this.battlePassService.getSeason(seasonId),
      progressData: this.battlePassService.getProgress(seasonId)
    }).pipe(
      map(({ seasonData, progressData }) => ({
        season: seasonData.season,
        progress: progressData.progress
      }))
    );
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
    if (!this.selectedSeasonId || this.claimingLevel || (this.progress && this.progress.claimedRewards.includes(level))) {
      return;
    }

    this.claimingLevel = level;
    this.battlePassService.claimReward(level, this.selectedSeasonId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          if (this.progress) {
            this.progress.claimedRewards.push(level);
          }
          this.claimingLevel = null;
        },
        error: () => {
          this.claimingLevel = null;
        }
      });
  }

  public getDisplayLevel(): number {
    if (!this.progress) return 1;
    const level = this.progress.level;
    return (typeof level === 'number' && !Number.isNaN(level)) ? level : 1;
  }

  public getExpPercentage(): number {
    if (!this.progress) {
      return 0;
    }
    const currentLevelExp = this.getCurrentLevelExp();
    const totalLevelExp = this.getTotalLevelExp();
    if (totalLevelExp === 0 || totalLevelExp === undefined || Number.isNaN(totalLevelExp)) {
      return 0;
    }
    const pct = (currentLevelExp / totalLevelExp) * 100;
    return Number.isNaN(pct) ? 0 : pct;
  }

  public getCurrentLevelExp(): number {
    if (!this.progress) return 0;
    const exp = (this.progress.exp ?? 0) - (this.progress.totalXpForCurrentLevel ?? 0);
    return Number.isNaN(exp) ? 0 : exp;
  }

  public getTotalLevelExp(): number {
    if (!this.progress) return 0;
    const xp = this.progress.nextLevelXp ?? 0;
    return Number.isNaN(xp) ? 0 : xp;
  }

  public addDebugExp(): void {
    this.battlePassService.addDebugExp(100)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.battlePassService.getProgress(this.selectedSeasonId || undefined)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (progressData) => {
                this.progress = progressData.progress;
              }
            });
        },
        error: () => {}
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
