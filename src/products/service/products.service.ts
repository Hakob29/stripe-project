import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../../entity/products-entity';
import { Repository, Connection } from 'typeorm';
import { httpexceptions } from 'src/execptions/utils/exception-prop';

@Injectable()
export class ProductsService {
  constructor(
    @InjectStripe() private readonly stripeProducts: Stripe,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly connection: Connection,
  ) {}

  queryRunner = this.connection.createQueryRunner();

  //----------CREATE PRODUCT-------------
  async createProduct(createProduct: CreateProductDto) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      //Create Product Stripe
      const stripeProduct = await this.stripeProducts.products.create({
        name: createProduct.name,
        description: createProduct.description,
      });

      //Create Price for product
      const price = await this.stripeProducts.prices.create({
        unit_amount: createProduct.unit_amount,
        currency: createProduct.currency,
        recurring: { interval: createProduct.recurring_interval },
        product: stripeProduct.id,
      });

      //Save product in Mysql2 DB
      const newProduct = this.queryRunner.manager.create(Product, {
        ...createProduct,
        id: stripeProduct.id,
        price_id: price.id,
      });
      const product = await this.productRepository.save(newProduct);
      await this.queryRunner.commitTransaction();
      return product;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }
  //GET ALL PRODUCTS
  async getAllProducts() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const list = await this.queryRunner.manager.find(Product);
      await this.queryRunner.commitTransaction();
      return list;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }

  //GET PRODUCT BY ID
  async getProductById(id: string) {
    try {
      const product = await this.stripeProducts.products.retrieve(id);
      return product;
    } catch (err) {
      httpexceptions(err.type || err);
    }
  }

  //--------DELETE PRODUCT--------------
  async deleteProdcut(id: string) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      //Get Product from Mysql2
      const product = await this.queryRunner.manager.findOne(Product, {
        where: { id: id },
      });

      //Delete first Plan second Product
      await this.stripeProducts.plans.del(product.price_id);

      await this.stripeProducts.products.del(product.id);

      //Delete product from Mysql2
      const delProduct = await this.queryRunner.manager.delete(
        Product,
        product.product_id,
      );
      await this.queryRunner.commitTransaction();
      return delProduct;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }

  //UPDATE PRODUCT
  async update(id: string, updatedProduct: UpdateProductDto) {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      //Update Product in Stripe
      await this.stripeProducts.products.update(id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
      });

      // Update Product in Mysql2 DB
      const product = await this.queryRunner.manager.findOne(Product, {
        where: { id: id },
      });

      const updated = await this.queryRunner.manager.update(
        Product,
        product.product_id,
        {
          name: updatedProduct.name,
          description: updatedProduct.description,
        },
      );
      await this.queryRunner.commitTransaction();
      return updated;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      httpexceptions(err.type || err);
    }
  }
}
