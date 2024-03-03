import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import {CreateProductDto} from "./dto/create-product.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RequestWithUserInterface} from "../auth/interfaces/requestWithUser.interface";


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    let posts = await this.productService.getAll();
    return { posts, count: posts.length}
  }



  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() dto: CreateProductDto, @Req() req: RequestWithUserInterface) {
    const user = req.user
    return await this.productService.create(dto, user)
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }


}
