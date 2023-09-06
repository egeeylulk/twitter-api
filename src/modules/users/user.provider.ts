import { Follower } from "./follower.entity";
import { User } from "./user.entity";

export const UserProvider=[
    {
        provide:'followerRepository',
        useValue:Follower
    },
    {
        provide:'userRepository',
        useValue:User
    }
]