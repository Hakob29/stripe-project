import { Users } from "./users-entity";
import { Product } from './products-entity';
import { Subscription } from "./users-subscription-entity";
import { StripeUsers } from "./stripeUsers.entity";

const entities = [ Users, Product, Subscription, StripeUsers ];

export default entities;

export { Users, Product, Subscription, StripeUsers };