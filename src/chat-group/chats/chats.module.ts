import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import {ChatsGateway} from "./chats.gateway";
import {Member} from "../../members/entities/member.entity";
import {Messages} from "../message/entities/messages.entity";
import {Chats} from "./entities/chats.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MembersModule} from "../../members/members.module";
import {MessageService} from "../message/message.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Chats, Messages, Member]),
      MembersModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway, MessageService],
})
export class ChatsModule {}
