import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index
} from 'typeorm';
import { BattlePassSeason } from './battle-pass-season';

export type BattlePassRewardType =
  | 'avatar'
  | 'sleeve'
  | 'playmat'
  | 'deck_box'
  | 'card_art';

@Entity('battle_pass_reward')
@Index(['seasonId', 'level', 'rewardType', 'itemId'], { unique: true })
export class BattlePassReward extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Denormalized season slug for queries; FK uses numeric season PK to avoid MySQL charset mismatches. */
  @Column({ type: 'varchar', length: 255 })
  seasonId!: string;

  @Column()
  seasonInternalId!: number;

  @ManyToOne(() => BattlePassSeason, season => season.rewards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seasonInternalId' })
  season!: BattlePassSeason;

  @Column({ type: 'int' })
  level!: number;

  @Column({ type: 'varchar', length: 32 })
  rewardType!: BattlePassRewardType;

  /** Catalog identifier (AvatarCatalog.identifier or Sleeve.identifier). */
  @Column({ type: 'varchar', length: 128 })
  itemId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}
