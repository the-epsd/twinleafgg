import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

@Entity('avatar_catalog')
export class AvatarCatalog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  identifier!: string;

  @Column()
  name!: string;

  @Column()
  fileName!: string;

  /** Always available without Battle Pass unlock. */
  @Column({ default: false })
  isDefault!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}
