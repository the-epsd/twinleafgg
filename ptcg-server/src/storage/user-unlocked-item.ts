import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './';

@Entity('user_unlocked_items')
export class UserUnlockedItem extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  itemId!: string;

  @Column()
  itemType!: string;

  @CreateDateColumn()
  created!: Date;

} 