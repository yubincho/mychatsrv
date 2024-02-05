import {Member} from "../../members/entities/member.entity";

export interface RequestWithUserInterface extends Request {
    user: Member
}