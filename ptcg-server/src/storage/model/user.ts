import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Deck } from './deck';
import { Replay } from './replay';
import { bigint } from '../transformers/bigint';

@Entity()
@Unique(['name'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name: string = '';

  @Column()
  public email: string = '';

  @Column()
  public password: string = '';

  @Column({ type: 'int', default: 0 })
  public roleId: number = 0;

  @Column({ type: 'bigint', transformer: [bigint] })
  public registered: number = 0;

  @Column({ type: 'bigint', transformer: [bigint] })
  public lastSeen: number = 0;

  @OneToMany(type => Deck, deck => deck.user)
    decks!: Deck[];

  @OneToMany(type => Replay, replay => replay.user)
    replays!: Replay[];

  public async updateLastSeen(): Promise<this> {
    this.lastSeen = Date.now();
    await User.update(this.id, { lastSeen: this.lastSeen });
    return this;
  }
}
