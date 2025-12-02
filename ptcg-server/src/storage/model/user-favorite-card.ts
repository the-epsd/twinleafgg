import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity('user_favorite_card')
@Unique(['user', 'cardName'])
export class UserFavoriteCard extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @Column()
  public userId!: number;

  @Column()
  public cardName: string = '';

  @Column()
  public fullName: string = '';

}
