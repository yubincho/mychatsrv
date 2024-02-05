import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {Messages} from "./entities/messages.entity";
import {Chats} from "../chats/entities/chats.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatsService} from "../chats/chats.service";

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Chats])],
  controllers: [MessageController],
  providers: [MessageService, ChatsService],
})
export class MessageModule {}
