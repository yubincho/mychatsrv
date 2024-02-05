import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {MembersService} from "../../members/members.service";
import {ConfigService} from "@nestjs/config";
import {ExtractJwt, Strategy} from "passport-jwt";
import {TokenPayloadInterface} from "../interfaces/tokenPayload.interface";


@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly membersService: MembersService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: TokenPayloadInterface) {
        return await this.membersService.getUserById(payload.userId)
    }
}