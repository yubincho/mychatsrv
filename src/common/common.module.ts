import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    // 다른 모듈...
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
