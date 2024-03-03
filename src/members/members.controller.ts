import {Body, Controller, Get, Param, Post, ValidationPipe} from '@nestjs/common';
import { MembersService } from './members.service';
import {CreateMemberDto} from "./dto/create-member.dto";

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('signup')
  async createUser(@Body(new ValidationPipe()) createMemberDto: CreateMemberDto) {
    return await this.membersService.registerMember(createMemberDto)
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return await this.membersService.getUserById(id);
  }

}
