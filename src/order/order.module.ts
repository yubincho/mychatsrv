import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {Member} from "../members/entities/member.entity";
import {Order} from "./entities/order.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";
import {Product} from "../product/entities/product.entity";
import {ProductService} from "../product/product.service";
import {MembersService} from "../members/members.service";
import {CategoryService} from "../category/category.service";
import {Category} from "../category/entities/category.entity";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Member, Product, Category])],
  controllers: [OrderController],
  providers: [OrderService, ConfigService, ProductService, MembersService, CategoryService, JwtService],
})
export class OrderModule {}
