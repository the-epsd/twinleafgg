import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export interface BattlePassReward {
  level: number;
  item: string;
  type: 'avatar' | 'card_back' | 'playmat' | 'marker' | 'card_artwork';
  name: string;
  isPremium: boolean;
}

@Entity()
export class BattlePassSeason extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  seasonId!: string;

  @Column()
  name!: string;

  @Column({ type: 'date', default: () => '(CURRENT_DATE)' })
  startDate!: Date;

  @Column({ type: 'date', default: () => '(CURRENT_DATE)' })
  endDate!: Date;

  @Column()
  rewardsFile!: string;

  rewards!: BattlePassReward[];

  @Column({ default: 1000 }) // Base XP needed per level
  baseXpPerLevel!: number;

  @Column({ default: 0 }) // XP increase per level
  xpIncreasePerLevel!: number;

  @Column({ default: 100 }) // Max level for the season
  maxLevel!: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @AfterLoad()
  loadRewards() {
    const rewardsPath = path.join(__dirname, this.rewardsFile);
    try {
      if (fs.existsSync(rewardsPath)) {
        const rawData = fs.readFileSync(rewardsPath, 'utf-8');
        this.rewards = JSON.parse(rawData);
      } else {
        console.error(`[BattlePass] Rewards file not found at: ${rewardsPath}`);
        this.rewards = [];
      }
    } catch (error) {
      console.error(`[BattlePass] Error loading or parsing rewards file: ${rewardsPath}`, error);
      this.rewards = [];
    }
  }

  /**
   * Get rewards for a specific level (premium track removed: only non-premium rewards are available)
   */
  public getRewardsForLevel(level: number, _isPremium: boolean): BattlePassReward[] {
    return this.rewards.filter(reward => reward.level === level && !reward.isPremium);
  }

  /**
   * Calculate XP needed for a specific level
   */
  public getXpForLevel(level: number): number {
    return this.baseXpPerLevel + (level - 1) * this.xpIncreasePerLevel;
  }

  /**
   * Calculate total XP needed up to a specific level
   */
  public getTotalXpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getXpForLevel(i);
    }
    return total;
  }

  /**
   * Get the level for a given amount of XP
   */
  public getLevelForXp(xp: number): number {
    let level = 1;
    while (level < this.maxLevel) {
      const xpForNextLevel = this.getTotalXpForLevel(level + 1);
      if (xp < xpForNextLevel) {
        return level;
      }
      level++;
    }
    return this.maxLevel;
  }
}
