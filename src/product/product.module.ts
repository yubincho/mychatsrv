import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {Product} from "./entities/product.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoryService} from "../category/category.service";
import {CategoryModule} from "../category/category.module";
import {Category} from "../category/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category],),
  ],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
