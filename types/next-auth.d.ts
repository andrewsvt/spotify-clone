import NextAuth, { Account, DefaultSession, Session, User } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: Session.accessToken;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string | null;
      refreshToken?: string | null;
      username?: string | null;
      error?: JWTError;
    };
  }
}

declare module 'next-auth/jwt' {
  type JWTError = string;
  interface JWT extends DefaultJWT {
    accessToken?: Account.accessToken;
    acessToken: string;
    refreshToken: string;
    username: string;
    accessTokenExpires: number;
    error?: JWTError;
    // username: Account.providerAccountId;
  }
}
