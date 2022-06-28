import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users-entity';
import { SharedProp } from './shared-prop';

@Entity()
export class Subscription extends SharedProp {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  subId: string

  @Column({
    nullable: false,
    default: '',
  })
  customerId: string 

  @Column({
    nullable: false,
    default: '',
  })
  prodId: string

  @Column({
    nullable: false,
    default: '',
  })
  priceId: string

  @Column({
    nullable: false,
  })
  active: boolean;

  @Column({
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: false,
    default: '',
  })
  currency: string;

  @Column({
    nullable: false,
    default: '',
  })
  interval: string;


  @ManyToOne(() => Users, (users: Users) => users.subscription, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: Users;
}
