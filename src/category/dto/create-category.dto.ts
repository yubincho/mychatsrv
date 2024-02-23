import {Column} from "typeorm";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    public desc: string;

    @IsString()
    public brandImg?: string;
}
