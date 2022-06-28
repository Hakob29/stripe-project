import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SharedProp } from './shared-prop';

@Entity()
export class Product extends SharedProp {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  product_id: number;

  @Column({
    default: '',
  })
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    nullable: false,
  })
  unit_amount: number;

  @Column({
    nullable: false,
    default: '',
  })
  currency: string;

  @Column({
    nullable: false,
    default: '',
  })
  recurring_interval: string;

  @Column({
    nullable: false,
    default: '',
  })
  price_id: string;
}
