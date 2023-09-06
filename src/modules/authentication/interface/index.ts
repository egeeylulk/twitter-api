import { IResponse } from "src/core/interface";
import { User } from "src/modules/users/user.entity";

export interface ILoginResponse extends IResponse {
    data: User;
}