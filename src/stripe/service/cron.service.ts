import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { sendMessage } from '../utils/sendMessage';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entity/users-subscription-entity';
import { Repository } from 'typeorm';
import { Users } from '../../entity/index';
import * as moment from 'moment-timezone';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  moment(): moment.Moment {
    return moment();
  }

  @Cron('0 * * * *')
  async getAllSubscription() {
    //Date time now
    const timeNow = moment().format('HH');

    //Get All subscriptions
    const subscriptons = await this.subscriptionRepository.find();

    subscriptons.forEach(async (data) => {
      if (data.interval === 'day') {
        //Subscription Time (-2 hour)
        const subTime = moment(data.createdAt).add(-2, 'hour').format('HH');
        if (timeNow === subTime) {
          //Find customer
          const customer = await this.usersRepository.findOne({
            where: { stripeUserId: data.customerId },
          });

          sendMessage(
            customer.email,
            'Please make your payment in two hours...',
          );
        }
      } else if (data.interval === 'week') {
        //Week Day now
        const dayWeekNow = moment().get('day');

        //Subscription Day (-1 week day)
        const subWeekDay = moment(data.createdAt).add(-1, 'day').get('day');

        if (dayWeekNow === subWeekDay && timeNow === '12') {
          const customer = await this.usersRepository.findOne({
            where: { stripeUserId: data.customerId },
          });

          sendMessage(customer.email, 'Please make your payment tomorrow...');
        }
      } else if (data.interval === 'month') {
        //Get date now
        const dateNow = moment().get('D');

        //Get sub Date (-1 day)
        const subDate = moment(data.createdAt).add(-1, 'day').get('D');

        if (dateNow === subDate && timeNow === '12') {
          const customer = await this.usersRepository.findOne({
            where: { stripeUserId: data.customerId },
          });

          sendMessage(customer.email, 'Please make your payment tomorrow...');
        }
      }
    });
  }
}
