import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import { LOGIN_URL, spotifyApi } from '../../../lib/spotify';

const refreshAccessToken = async (token: JWT) => {
  try {
    spotifyApi.setAccessToken(token.acessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log('REFRESHED TOKEN IS', refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + Number(refreshedToken.expires_in) * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Number(account.expires_at) * 1000,
          username: account.providerAccountId,
          // @ts-ignore
          refreshToken: account.refresh_token,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING TOKEN IS VALID');
        return token;
      }

      // Access token has expired, try to update it
      console.log('ACCESS TOKEN HAS EXPIRED');
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      console.log('session', session);
      if (session && session.user) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
        session.user.error = token.error || null;
      }

      return session;
    },
  },
});
