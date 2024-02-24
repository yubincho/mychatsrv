import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {Category} from "./entities/category.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {ProductModule} from "../product/product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]), JwtModule.register({}),
    ConfigModule,

  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: []
})
export class CategoryModule {}
