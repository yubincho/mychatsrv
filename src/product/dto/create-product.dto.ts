import {IsNotEmpty, IsString} from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    prodImage?: string;

    @IsString()
    @IsNotEmpty()
    price: number;

    @IsString()
    categoryId: string;

}