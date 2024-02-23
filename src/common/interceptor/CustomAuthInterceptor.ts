
// custom-auth.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class CustomAuthInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // 요청 헤더에서 토큰 추출
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
        }

        try {
            // 토큰 검증
            const decoded = this.jwtService.verify(token, { secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET') });
            // 요청 객체에 사용자 정보 추가
            request.user = decoded;
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return next.handle();
    }
}
