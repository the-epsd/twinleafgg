import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('card_artworks')
export class CardArtwork extends BaseEntity {

  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    name!: string;

  @Column()
    cardName!: string;

  @Column()
    setCode!: string;

  @Column()
    code!: string;

  @Column()
    imageUrl!: string;

  @Column({ default: 'default' })
    holoType!: string;

} 