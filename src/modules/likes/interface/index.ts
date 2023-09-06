import { IResponse } from "src/core/interface";
import { Like } from "../like.entity";

export interface ILikeResponse extends IResponse{
   data:Like[];
}