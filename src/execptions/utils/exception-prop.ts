import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

export function httpexceptions(err: any) {
  switch (err.type) {
    case 'StripeCardError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    case 'StripeRateLimitError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException('Rate Limiting', HttpStatus.TOO_MANY_REQUESTS);
    case 'StripeInvalidRequestError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    case 'StripeAPIError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException('API Error', HttpStatus.INTERNAL_SERVER_ERROR);
    case 'StripeConnectionError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException(
        'Stripe Connection Error',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    case 'StripeAuthenticationError':
      console.log(`A payment error occurred: ${err.message}`);
      throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);
    default:
      // Handle any other types of unexpected errors
      console.log('Another problem occurred, maybe unrelated to Stripe.');
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
  }
}
