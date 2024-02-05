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
      ChatsModule, MessageModule, MembersModule, DatabaseModule, CommonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
