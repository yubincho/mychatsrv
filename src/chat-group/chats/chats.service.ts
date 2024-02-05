import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chats} from "./entities/chats.entity";
import {Repository} from "typeorm";
import {WsException} from "@nestjs/websockets";

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chats)
        private readonly chatsRepository: Repository<Chats>
    ) {}


    async checkIfChatExists(chatId: number) {
        const exists = await this.chatsRepository.exists({
            where: { id: chatId },
        })
        return exists
    }


    async findByIdOfChat(id: number) {
        const chat = await this.chatsRepository.findOne({
            where: { id }
        })
        if (!chat) {
            throw new WsException(`채팅방 아이디를 찾을 수 없습니다. Chat ID: ${id}`)
        }
        return chat
    }



}
