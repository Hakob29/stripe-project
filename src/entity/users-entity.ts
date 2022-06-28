import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SharedProp } from './shared-prop';
import { Subscription } from './users-subscription-entity';

@Entity()
export class Users extends SharedProp {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
  })
  name: string;


  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  stripeUserId: string;

  @Column({
    nullable: false,
  })
  number: string;

  @Column({
    nullable: false,
  })
  exp_month: number;

  @Column({
    nullable: false,
  })
  exp_year: number;

  @Column({
    nullable: false,
  })
  cvc: string;

  @Column({
    nullable: false,
    default: '',
  })
  paymontMethodId: string;

  @OneToMany(
    'Subscription',
    (subscription: Subscription) => subscription.users,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  subscription: Array<Subscription>;
}
