import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectStripe } from 'nestjs-stripe';
import { Product } from 'src/entity/index';
import { Subscription } from 'src/entity/users-subscription-entity';
import { Stripe } from 'stripe';
import { Repository, Connection } from 'typeorm';
import { Users } from '../../entity/users-entity';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { DeleteSubscriptionDto } from '../dto/delete-subscription.dto';
import { Cache } from 'cache-manager';
import { sendMessage } from '../utils/sendMessage';
import { httpexceptions } from 'src/execptions/utils/exception-prop';

@Injectable()
export class StripeService {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly connection: Connection,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  queryRunner = this.connection.createQueryRunner();

  //----------CREATE SUBSCRIPTION FOR CUSTOMER----------
  async createSubscription(createSubscription: CreateSubscriptionDto) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const subCustomer = await this.stripe.subscriptions.create({
        customer: createSubscription.customerId,
        items: [
          {
            price: createSubscription.priceId,
          },
        ],
      });

      const userId = await this.queryRunner.manager.findOne(Users, {
        where: { stripeUserId: createSubscription.customerId },
      });

      const savedData: any = {
        subId: subCustomer.id,
        customerId: subCustomer.customer,
        prodId: subCustomer.items.data[0].plan.product,
        priceId: subCustomer.items.data[0].price.id,
        active: subCustomer.items.data[0].plan.active,
        amount: subCustomer.items.data[0].plan.amount,
        currency: subCustomer.items.data[0].plan.currency,
        interval: subCustomer.items.data[0].plan.interval,
        users: userId.id,
      };

      const subResult = await this.queryRunner.manager.create(
        Subscription,
        savedData,
      );

      await this.queryRunner.manager.save(Subscription, subResult);

      await this.cacheManager.store.set(
        createSubscription.customerId,
        subResult,
        { ttl: 0 },
      );

      await this.queryRunner.commitTransaction();
      return subCustomer;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }

  //GET ALL SUBSCRIPTIONS OF USER BY ID
  async getAllSubscriptionsById(id: string) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const customer = await this.queryRunner.manager.findOne(Users, {
        where: { stripeUserId: id },
      });

      const data = await this.queryRunner.manager.find(Subscription, {
        relations: ['users'],
        where: { users: customer.id },
      });

      await this.queryRunner.commitTransaction();
      return data;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }

  //GET ALL SUBSCRIPTIONS
  async getAllSubscriptions() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const list = await this.queryRunner.manager.find(Subscription);
      await this.queryRunner.commitTransaction();
      return list;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }

  //CANCEL SUBSCRIPTIONS
  async deleteSubscription(deleteSub: DeleteSubscriptionDto) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const subscription = await this.queryRunner.manager.findOne(
        Subscription,
        {
          where: { subId: deleteSub.subscriptionId },
        },
      );

      const customer = await this.queryRunner.manager.findOne(Users, {
        where: {
          stripeUserId: subscription.customerId,
        },
      });

      await this.queryRunner.manager.delete(Subscription, subscription.id);

      const delSub = await this.cacheManager.store.del(subscription.customerId);

      sendMessage(
        customer.email,
        'You have successfully cancelled your subscription...',
      );
      await this.stripe.subscriptions.del(deleteSub.subscriptionId);
      await this.queryRunner.commitTransaction();
      return delSub;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }
}
