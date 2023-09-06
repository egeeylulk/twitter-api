import { IResponse } from "src/core/interface";
import { Tweet } from "../tweet.entity";

export interface ITweetResponse extends IResponse{
    data:Tweet[];
}
export interface ITweetResponse2 extends IResponse{
    data:Tweet | null;
}