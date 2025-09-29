import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user';

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

@Entity()
export class FriendRequest extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public sender_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  public sender!: User;

  @Column()
  public receiver_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  public receiver!: User;

  @Column({
    type: 'varchar',
    default: FriendRequestStatus.PENDING
  })
  public status!: FriendRequestStatus;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;

  public static async findRequest(senderId: number, receiverId: number): Promise<FriendRequest | null> {
    const request = await FriendRequest.findOne({
      where: { sender_id: senderId, receiver_id: receiverId },
      relations: ['sender', 'receiver']
    });
    return request || null;
  }

  public static async getPendingRequests(userId: number): Promise<FriendRequest[]> {
    return await FriendRequest.find({
      where: { receiver_id: userId, status: FriendRequestStatus.PENDING },
      relations: ['sender', 'receiver']
    });
  }

  public static async getSentRequests(userId: number): Promise<FriendRequest[]> {
    return await FriendRequest.find({
      where: { sender_id: userId, status: FriendRequestStatus.PENDING },
      relations: ['sender', 'receiver']
    });
  }
} 