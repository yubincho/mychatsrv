import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {ChatsModule} from "./chat-group/chats/chats.module";
import { MembersModule } from './members/members.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';

import * as Joi from '@hapi/joi';
import {ConfigModule} from "@nestjs/config";
import {MessageModule} from "./chat-group/message/message.module";
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import {JwtModule} from "@nestjs/jwt";
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),

      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
      ChatsModule, MessageModule, MembersModule, DatabaseModule, CommonModule, AuthModule, ProductModule,  CategoryModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
