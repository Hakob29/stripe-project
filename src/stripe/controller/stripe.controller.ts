import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { StripeService } from '../service/stripe.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { DeleteSubscriptionDto } from '../dto/delete-subscription.dto';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from '../../execptions/model/execptions-model';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../execptions/sentry-Interceptor';

@UseInterceptors(SentryInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('stripe')
@UseFilters(AllExceptionsFilter)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  //CREATE SUBSCRIPTION
  @Post('/createsub')
  async createSubscription(@Body() createSubscription: CreateSubscriptionDto) {
    return this.stripeService.createSubscription(createSubscription);
  }

  //GET ALL SUBSCRIPTIONS
  @Get('/getsub')
  async getAllSubscription() {
    return this.stripeService.getAllSubscriptions();
  }

  //GET ALL SUBSCRIPTIONS By ID
  @Get('/getsub/:id')
  async getAllSubscriptionsById(@Param('id') id: string) {
    return this.stripeService.getAllSubscriptionsById(id);
  }

  //DELETE SUBSCRIPTION
  @Delete('/delete')
  async deleteSubscription(@Body() deleteSub: DeleteSubscriptionDto) {
    return this.stripeService.deleteSubscription(deleteSub);
  }
}
