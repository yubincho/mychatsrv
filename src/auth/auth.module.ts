import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {MembersModule} from "../members/members.module";
import {LocalAuthStrategy} from "./strategies/local-auth.strategy";
import {PassportModule} from "@nestjs/passport";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {JwtAuthStrategy} from "./strategies/jwt-auth.strategy";

@Module({
  imports: [MembersModule, PassportModule, ConfigModule, JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtAuthStrategy],
})
export class AuthModule {}
