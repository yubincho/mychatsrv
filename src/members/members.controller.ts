import {Body, Controller, Post} from '@nestjs/common';
import { MembersService } from './members.service';
import {CreateMemberDto} from "./dto/create-member.dto";

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('signup')
  async createUser(@Body() createMemberDto: CreateMemberDto) {
    return await this.membersService.registerMember(createMemberDto)
  }


}
