import {CommonEntity} from "../../common/entities/common.entity";
import {BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {ProviderEnum} from "./provider.enum";
import {RoleEnum} from "./role.enum";
import * as bcrypt from 'bcrypt';
import * as gravatar from 'gravatar';
import {HttpException, HttpStatus} from "@nestjs/common";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Chats} from "../../chat-group/chats/entities/chats.entity";
import {Messages} from "../../chat-group/message/entities/messages.entity";
import {Order} from "../../order/entities/order.entity";


@Entity()
export class Member extends CommonEntity {

    @IsNotEmpty()
    @IsString()
    @Column({ nullable: false })
    public name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Column({ unique: true })
    public email: string;

    /** 가입 비밀번호
     * Oauth로 가입된 경우 비밀번호 없으므로 옵션 처리함 */
    @IsNotEmpty()
    @IsString()
    @Column({ nullable: true })
    public password?: string;

    /** 프로필 이미지
     * 디폴트 - 이미지 생성 */
    @IsString()
    @Column({ nullable: true })
    public profileImg?: string;

    /** Oauth2로 유입 구분
     * 구글, 네이버, 카카오, 로컬 */
    @IsString()
    @Column({
        type: 'enum',
        enum: ProviderEnum,
        default: ProviderEnum.LOCAL,
    })
    public provider?: ProviderEnum;

    /** 유저 역할
     * 관리자, 운영자, 일반 유저 */
    @IsString()
    @Column({
        type: 'enum',
        enum: RoleEnum,
        array: true,
        default: [RoleEnum.USER],
    })
    public roles: RoleEnum[];

    /** (주문에 필요한) 결제 포인트 잔액
     * 디폴트 : 0원
     * */
    @Column({ default: 0 })
    public point: number;

    /** 주문 */
    @OneToMany(() => Order, (order: Order) => order.user)
    public orders: Order[];

    /** 채팅방 */
    @ManyToMany(() => Chats, (chat) => chat.users)
    @JoinTable()
    chats: Chats[];

    /** 채팅 메시지 */
    @OneToMany(() => Messages, (message) => message.author)
    messages: Messages[];

    /** 회원가입시 데이터 저장전 실행되는 함수
     * 프로필 이미지 자동 생성, 비밀번호 해시화 */
    @BeforeUpdate()
    @BeforeInsert()
    async beforeFunction(): Promise<void> {
        try {
            this.profileImg = gravatar.url(this.email, {
                s: '200',
                r: 'pg',
                d: 'mm',
                protocol: 'https',
            })
            console.log(this.profileImg)

            const saltValue = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, saltValue)
            this.password = hashedPassword
            console.log(hashedPassword)
        } catch (error) {
            console.error(error.message)
            throw new HttpException('비밀번호 오류입니다.', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async checkPassword(userPassword: string): Promise<boolean> {
        if (this.password === undefined) return false

        try {
            const isMatchedPassword = await bcrypt.compare(
                userPassword,
                this.password
            )
            return isMatchedPassword
        } catch (error) {
            throw new HttpException('비밀번호가 맞지 않습니다.', HttpStatus.CONFLICT)
        }
    }

}