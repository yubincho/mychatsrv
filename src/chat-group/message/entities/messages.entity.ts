import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsString} from "class-validator";
import {Chats} from "../../chats/entities/chats.entity";
import {Member} from "../../../members/entities/member.entity";

/** 채팅 메시지 */
@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    @IsString()
    message: string;

    @CreateDateColumn()
    public createdAt: Date;

    @ManyToOne(() => Chats, (chat) => chat.messages)
    chat: Chats;

    @ManyToOne(() => Member, (user) => user.messages)
    author: Member;
}