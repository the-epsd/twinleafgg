import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { BattlePassReward } from './battle-pass-reward';

export type BattlePassSeasonStatus = 'draft' | 'published' | 'archived';

@Entity()
export class BattlePassSeason extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  seasonId!: string;

  @Column()
  name!: string;

  @Column({ type: 'date', default: () => '(CURRENT_DATE)' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ default: 'published' })
  status!: BattlePassSeasonStatus;

  @Column({ default: 1000 })
  baseXpPerLevel!: number;

  @Column({ default: 0 })
  xpIncreasePerLevel!: number;

  @Column({ default: 100 })
  maxLevel!: number;

  @OneToMany(() => BattlePassReward, reward => reward.season, { cascade: true })
  rewards!: BattlePassReward[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  public getRewardsForLevel(level: number): BattlePassReward[] {
    const rewards = this.rewards ?? [];
    return rewards
      .filter(reward => reward.level === level)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }

  public getXpForLevel(level: number): number {
    return this.baseXpPerLevel + (level - 1) * this.xpIncreasePerLevel;
  }

  public getTotalXpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getXpForLevel(i);
    }
    return total;
  }

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
