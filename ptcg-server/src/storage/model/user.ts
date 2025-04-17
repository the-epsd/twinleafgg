import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Avatar } from './avatar';
import { Deck } from './deck';
import { Replay } from './replay';
import { Rank, rankLevels } from '../../backend/interfaces/rank.enum';
import { bigint } from '../transformers/bigint';
import { Sleeve } from './sleeve';

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
  public ranking: number = 0;

  @Column()
  public password: string = '';

  @Column({ type: 'int', default: 0 })
  public roleId: number = 0;

  @Column({ type: 'bigint', transformer: [bigint] })
  public registered: number = 0;

  @Column({ type: 'bigint', transformer: [bigint] })
  public lastSeen: number = 0;

  @Column({ type: 'bigint', transformer: [bigint] })
  public lastRankingChange: number = 0;

  @Column()
  public avatarFile: string = '';

  @Column({ nullable: true })
  public sleeveFile: string = '';

  @OneToMany(type => Deck, deck => deck.user)
  decks!: Deck[];

  @OneToMany(type => Avatar, avatar => avatar.user)
  avatars!: Avatar[];

  @OneToMany(type => Replay, replay => replay.user)
  replays!: Replay[];

  @OneToMany(type => Sleeve, sleeve => sleeve.user)
  sleeves!: Sleeve[];

  public getRank(): Rank {
    let rank = rankLevels[0].rank;
    for (const level of rankLevels) {
      if (level.points > this.ranking) {
        break;
      }
      rank = level.rank;
    }
    return rank;
  }

  public async updateLastSeen(): Promise<this> {
    this.lastSeen = Date.now();
    await User.update(this.id, { lastSeen: this.lastSeen });
    return this;
  }
}
