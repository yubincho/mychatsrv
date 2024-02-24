import {IsInt, IsNotEmpty, Min} from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}