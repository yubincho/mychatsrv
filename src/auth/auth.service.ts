import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {MembersService} from "../members/members.service";
import {CreateMemberDto} from "../members/dto/create-member.dto";
import {LoginMemberDto} from "../members/dto/login-member.dto";
import {TokenPayloadInterface} from "./interfaces/tokenPayload.interface";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  constructor(
      private readonly membersService: MembersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
  ) {}


   async registerUser(createMemberDto: CreateMemberDto) {
     const newUser = await this.membersService.registerMember(createMemberDto)
     return newUser
   }


   async loggedInUser(loginMemberDto: LoginMemberDto) {
        const user = await this.membersService.getUserByEmail(loginMemberDto.email)

       const isMatchedPassword = await user.checkPassword(loginMemberDto.password)

       if (!isMatchedPassword) {
           console.error('Password does not match!')
           throw new HttpException('Password does not match!', HttpStatus.CONFLICT)
       }
       return user
   }


   async generateAccessToken(userId: string) {
        const payload: TokenPayloadInterface = { userId }

        const token = await this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            )}h`
        })

        return token
   }



}
