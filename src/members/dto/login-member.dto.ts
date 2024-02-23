import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class LoginMemberDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}