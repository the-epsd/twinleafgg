import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sleeves')
export class Sleeve extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public identifier: string = '';

  @Column()
  public name: string = '';

  @Column({ name: 'is_default', type: 'boolean', default: false })
  public isDefault: boolean = false;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  public sortOrder: number = 0;

  @Column({ name: 'image_path' })
  public imagePath: string = '';

  /** When true, only users with a matching unlock may use this sleeve. Defaults are always free. */
  @Column({ name: 'requires_unlock', type: 'boolean', default: true })
  public requiresUnlock: boolean = true;
}
