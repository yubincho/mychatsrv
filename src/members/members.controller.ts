import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { MembersService } from './members.service';
import {CreateMemberDto} from "./dto/create-member.dto";

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('signup')
  async createUser(@Body(new ValidationPipe()) createMemberDto: CreateMemberDto) {
    return await this.membersService.registerMember(createMemberDto)
  }


}
