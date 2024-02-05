import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Messages} from "./entities/messages.entity";
import {Repository} from "typeorm";
import {CreateMessageDto} from "./dto/create-message.dto";
import {ChatsService} from "../chats/chats.service";

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Messages)
        private readonly messageRepository: Repository<Messages>,
        private readonly chatsService: ChatsService
    ) {}


    async createMessages(createMessageDto: CreateMessageDto, authorId: string) {
        const chat = await this.chatsService.findByIdOfChat(createMessageDto.chatId)
        const message = await this.messageRepository.save({
            chat,
            author: { id: authorId },
            message: createMessageDto.message,
        })

        return message
    }

}
