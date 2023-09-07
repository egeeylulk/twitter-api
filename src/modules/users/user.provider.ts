import { Follower } from "./follower.entity";
import { User } from "./user.entity";
import { Like } from "../likes/like.entity";
import { Tweet } from "../tweets/tweet.entity";

export const UserProvider=[
    {
        provide:'followerRepository',
        useValue:Follower
    },
    {
        provide:'userRepository',
        useValue:User
    },
    {
        provide:'likesRepository',
        useValue:Like
    },
    {
        provide:'tweetsRepository',
        useValue:Tweet
    }
]