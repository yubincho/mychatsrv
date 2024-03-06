import {POINT_TRANSACTION_STATUS_ENUM} from "../dto/point-transaction-status.enum";
import {RequestWithUserInterface} from "../../auth/interfaces/requestWithUser.interface";

export interface IPointTransactionCreate {
    impUid: string;
    quantity: number;
    productId: string;
    user: RequestWithUserInterface['user'];
    status?: POINT_TRANSACTION_STATUS_ENUM;
}

