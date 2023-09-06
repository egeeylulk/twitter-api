import { Tweet } from "./tweet.entity";

export const UserProvider=[
    {
        provide:'tweetsRepository',
        useValue:Tweet
    },
    
]