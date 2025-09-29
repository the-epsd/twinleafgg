import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked'
}

@Entity()
export class Friend extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column()
  public friend_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friend_id' })
  public friend!: User;

  @Column({
    type: 'varchar',
    default: FriendStatus.PENDING
  })
  public status!: FriendStatus;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;

  public static async findFriendship(userId: number, friendId: number): Promise<Friend | null> {
    const friendship = await Friend.findOne({
      where: [
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId }
      ],
      relations: ['user', 'friend']
    });
    return friendship || null;
  }

  public static async getFriendsList(userId: number): Promise<Friend[]> {
    return await Friend.find({
      where: [
        { user_id: userId, status: FriendStatus.ACCEPTED },
        { friend_id: userId, status: FriendStatus.ACCEPTED }
      ],
      relations: ['user', 'friend']
    });
  }

  public static async getPendingRequests(userId: number): Promise<Friend[]> {
    return await Friend.find({
      where: { friend_id: userId, status: FriendStatus.PENDING },
      relations: ['user', 'friend']
    });
  }

  public static async getSentRequests(userId: number): Promise<Friend[]> {
    return await Friend.find({
      where: { user_id: userId, status: FriendStatus.PENDING },
      relations: ['user', 'friend']
    });
  }
} 