import {ProviderEnum} from "../entities/provider.enum";
import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class CreateMemberDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    password?: string;

    @IsString()
    provider?: ProviderEnum;

    @IsString()
    profileImg?: string;
}