import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUserDto } from '../dto/update-users.dto';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { Cache } from 'cache-manager';
import { Connection } from 'typeorm';
import { httpexceptions } from 'src/execptions/utils/exception-prop';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly connection: Connection,
    @InjectBot() private readonly bot: Telegraf<Context>,
    @InjectStripe() private readonly stripeUser: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  queryRunner = this.connection.createQueryRunner();

  //------------CREATE USER FOR STRIPE  AND SAVE---------------
  async createUser(creatUser: CreateUsersDto) {
    //Save user in stripe
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const customer = await this.stripeUser.customers.create({
        name: creatUser.name,
        email: creatUser.email,
      });

      //Create Card for Customer
      const paymont = await this.stripeUser.paymentMethods.create({
        type: 'card',
        card: {
          number: creatUser.number,
          exp_month: creatUser.exp_month,
          exp_year: creatUser.exp_year,
          cvc: creatUser.cvc,
        },
      });

      //Set Card to customer
      await this.stripeUser.paymentMethods.attach(paymont.id, {
        customer: customer.id,
      });

      //Set card as default for customer
      await this.stripeUser.customers.update(customer.id, {
        source: 'tok_visa',
      });

      //Save User in Mysql2
      const newUser = this.queryRunner.manager.create(Users, {
        ...creatUser,
        stripeUserId: customer.id,
        paymontMethodId: paymont.id,
      });

      await this.queryRunner.manager.save(newUser);
      await this.queryRunner.commitTransaction();

      return newUser;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      await this.bot.telegram.sendMessage(879727058, err);
      httpexceptions(err.type || err);
    }
  }

  //------------GET ALL USERS----------
  async getAllUsers() {
    try {
      const data = await this.stripeUser.customers.list();
      return data;
    } catch (err) {
      await this.bot.telegram.sendMessage(879727058, err);
      httpexceptions(err.type || err);
    }
  }

  //-----------GET USER BY ID----------------
  async getUserById(id: string) {
    try {
      const data = await this.stripeUser.customers.retrieve(id);
      return data;
    } catch (err) {
      await this.bot.telegram.sendMessage(879727058, err);
      httpexceptions(err.type || err);
    }
  }

  //---------DELETE USER BY ID----------------
  async deleteUser(id: string) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      //Delete User from Stripe
      await this.stripeUser.customers.del(id);

      //Delete User from Mysql2
      const deletedCustomer = await this.queryRunner.manager.findOne(Users, {
        where: { stripeUserId: id },
      });
      const delCustomer = await this.queryRunner.manager.delete(
        Users,
        deletedCustomer.id,
      );

      await this.queryRunner.commitTransaction();
      return delCustomer;
    } catch (err) {
      // await this.queryRunner.rollbackTransaction();
      await this.bot.telegram.sendMessage(879727058, err);
      httpexceptions(err.type || err);
    }
  }

  //----------UPDATE USER BY ID-------------
  async updateUser(id: string, updateUser: UpdateUserDto) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      //Update Customer in stripe
      await this.stripeUser.customers.update(id, {
        name: updateUser.name,
        email: updateUser.email,
      });

      //Update Customer in Mysql2 DB
      const customer = await this.queryRunner.manager.findOne(Users, {
        where: { stripeUserId: id },
      });
      const updatedUser = await this.queryRunner.manager.update(
        Users,
        customer.id,
        {
          name: updateUser.name,
          email: updateUser.email,
        },
      );
      await this.queryRunner.commitTransaction();
      return updatedUser;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      await this.bot.telegram.sendMessage(879727058, err);
      httpexceptions(err.type || err);
    }
  }
}
