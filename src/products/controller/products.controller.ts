import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from '../../execptions/All-Execptions.filter';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../execptions/sentry-Interceptor';

@UseInterceptors(SentryInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('products')
@UseFilters(AllExceptionsFilter)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //CREATE NEW PRODUCT
  @Post('/create')
  async createProduct(@Body() createProduct: CreateProductDto) {
    return this.productsService.createProduct(createProduct);
  }

  //GET ALL PRODUCTS
  @Get('/get')
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  //GET PRODUCT BY ID
  @Get('/get/:id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  //DELETE PRODUCT BY ID
  @Delete('/delete/:id')
  async deleteProdcut(@Param('id') id: string) {
    return this.productsService.deleteProdcut(id);
  }

  //UPDATE PRODUCT BY ID
  @Put('/update/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updatedProduct: UpdateProductDto,
  ) {
    return this.productsService.update(id, updatedProduct);
  }
}
