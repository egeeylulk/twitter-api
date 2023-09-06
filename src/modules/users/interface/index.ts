import { IResponse } from "src/core/interface";
import { User } from "../user.entity";

export interface IUserResponse extends IResponse{
    data:User[]| any;
}
export interface IUserResponse2 extends IResponse{
    data:User|null;
}