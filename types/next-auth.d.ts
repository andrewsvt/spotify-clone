import NextAuth, { Account, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: Session.accessToken,
        user: {
            acessToken?: string;
            refreshToken?: string;
            username?: string;
            name: string;
            email: string;
            image: string;
          };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: Account.accessToken
        acessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        username: Account.providerAccountId;
    }
}