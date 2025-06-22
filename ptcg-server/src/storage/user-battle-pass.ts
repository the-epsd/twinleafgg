import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User, BattlePassSeason } from './';

@Entity()
export class UserBattlePass extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  seasonId!: string;

  @ManyToOne(() => BattlePassSeason)
  @JoinColumn({ name: 'seasonId', referencedColumnName: 'seasonId' })
  season!: BattlePassSeason;

  @Column({ default: 0 })
  exp!: number;

  @Column({ default: 1 })
  level!: number;

  @Column('simple-json')
  claimedRewards: number[] = [];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  public async canClaimReward(level: number): Promise<boolean> {
    if (level < 1 || level > this.level) {
      return false;
    }
    return !this.claimedRewards.includes(level);
  }

  public async claimReward(level: number): Promise<void> {
    if (await this.canClaimReward(level)) {
      this.claimedRewards.push(level);
    }
  }

  public async addExp(exp: number): Promise<void> {
    this.exp += exp;
    const currentLevel = this.level;
    const newLevel = this.season.getLevelForXp(this.exp);
    if (newLevel > currentLevel) {
      this.level = newLevel;
    }
  }
} 