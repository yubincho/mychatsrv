import {Injectable} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import {ProviderEnum} from "../../members/entities/provider.enum";

@Injectable()
export class LocalAuthGuard extends AuthGuard(ProviderEnum.LOCAL) {}