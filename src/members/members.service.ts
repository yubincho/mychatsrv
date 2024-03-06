import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Member} from "./entities/member.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateMemberDto} from "./dto/create-member.dto";

@Injectable()
export class MembersService {

    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>
    ) {}


    async registerMember(createMemberDto: CreateMemberDto) {

        const { email } = createMemberDto
        const existingMember = await this.memberRepository.findOne({ where : { email }})
        if (existingMember) {
            throw new HttpException('이미 존재하는 회원입니다.', HttpStatus.BAD_REQUEST)
        }
        const createUser = await this.memberRepository.create(createMemberDto)
        const newUser = await this.memberRepository.save(createUser)
        return newUser
    }


    // async getUserByEmail(email: string) {
    //     const user = await this.memberRepository.findOne({
    //         where: { email },
    //         relations: ['products', 'orders', ],
    //     },
    // )
    //     if (user) return user
    //     throw new HttpException('없는 회원입니다.', HttpStatus.NOT_FOUND)
    // }
    async getUserByEmail(email: string) {
        const user = await this.memberRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .leftJoinAndSelect('user.products', 'products')
            .leftJoinAndSelect('products.category', 'category')
            .leftJoinAndSelect('user.orders', 'orders')
            .getOne();
        if (user) return user;
        throw new HttpException('없는 회원입니다.', HttpStatus.NOT_FOUND);

    }

    // async getUserById(id: string) {
    //     const user = await this.memberRepository.findOne({
    //         where: { id },
    //         relations: ['products', 'orders']
    //     })
    //     if (user) return user
    //     throw new HttpException('없는 회원입니다.', HttpStatus.NOT_FOUND)
    // }
    async getUserById(id: string) {
        const user = await this.memberRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .leftJoinAndSelect('user.products', 'products')
            .leftJoinAndSelect('products.category', 'category')
            // .leftJoinAndSelect('user.orders', 'orders')
            .getOne();

        if (user) return user;
        throw new HttpException('없는 회원입니다.', HttpStatus.NOT_FOUND);
    }


    async updateUserPoint(orderAmount: number, userId: string) {
        const user = await this.memberRepository.findOne({
            where: { id: userId }
        })
        const updatedUser = this.memberRepository.create({
            ...user,
            point: user.point + orderAmount,
        })

        return updatedUser;
    }



}
