import {Body, Controller, Get, Post} from '@nestjs/common';
import { ProductService } from './product.service';
import {CreateProductDto} from "./dto/create-product.dto";


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    return await this.productService.getAll()
  }


  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto)
  }



}
