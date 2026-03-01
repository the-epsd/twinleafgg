import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Match } from './model';
import { User } from './model';

@Entity()
export class MatchXpAward extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @Index()
  public matchId!: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'matchId' })
  public match!: Match;

  @Column()
  @Index()
  public userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public seasonId!: string | null;

  @Column()
  public xpGained!: number;

  @Column()
  public previousExp!: number;

  @Column()
  public newExp!: number;

  @Column()
  public previousLevel!: number;

  @Column()
  public newLevel!: number;

  @Column({ default: false })
  public viewed!: boolean;
}
