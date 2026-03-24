import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { bigint } from '../transformers/bigint';

@Entity('disconnected_session')
export class DisconnectedSession extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @Column()
  public gameId!: number;

  @Column({ type: 'text' })
  public gameState!: string; // Serialized game state

  @Column({ type: 'bigint', transformer: [bigint] })
  public disconnectedAt!: number;

  @Column({ type: 'bigint', transformer: [bigint] })
  public expiresAt!: number;

  @Column()
  public gamePhase!: string;

  @Column({ default: false })
  public isPlayerTurn!: boolean;

  @Column({ type: 'text', nullable: true })
  public disconnectionReason?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user!: User;

}