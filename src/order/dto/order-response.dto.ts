import {Member} from "../../members/entities/member.entity";
import {POINT_TRANSACTION_STATUS_ENUM} from "./point-transaction-status.enum";

export class OrderResponseDto {
    orderAmount: number;
    impUid: string;
    user: Member;
    status: POINT_TRANSACTION_STATUS_ENUM;
}