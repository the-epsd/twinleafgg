import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class CustomAvatar extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => User, user => user.customAvatar)
  @JoinColumn()
  public user!: User;

  @Column({ default: 'face_1' })
  public face: string = 'face_1';

  @Column({ default: 'hair_1' })
  public hair: string = 'hair_1';

  @Column({ default: '' })
  public glasses: string = '';

  @Column({ default: 'shirt_1' })
  public shirt: string = 'shirt_1';

  @Column({ default: '' })
  public hat: string = '';

  @Column({ default: '' })
  public accessory: string = '';

} 