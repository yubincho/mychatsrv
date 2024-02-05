import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {CreateMemberDto} from "../members/dto/create-member.dto";
import {RequestWithUserInterface} from "./interfaces/requestWithUser.interface";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signup')
  async createUser(@Body()  createMemberDto: CreateMemberDto) {
    const newUser = await this.authService.registerUser(createMemberDto)
    return newUser
  }


  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Req() req: RequestWithUserInterface) {
    const user = req.user

    const token = await this.authService.generateAccessToken(user.id)

    user.password = undefined
    return { user, token }
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: RequestWithUserInterface) {
    return req.user
  }



}
