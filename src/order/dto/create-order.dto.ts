import {IsInt, IsNotEmpty, Min} from "class-validator";
import {RequestWithUserInterface} from "../../auth/interfaces/requestWithUser.interface";
import {POINT_TRANSACTION_STATUS_ENUM} from "./point-transaction-status.enum";

export class CreateOrderDto {

    impUid: string;

    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    status?: POINT_TRANSACTION_STATUS_ENUM;

    user: RequestWithUserInterface['user'];

}