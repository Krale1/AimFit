import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account?.id_token) {
          console.error("No id_token from Google account");
          return false;
        }

        const res = await fetch(`${process.env.BACKEND_API_URL}/api/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: account.id_token }),
        });

        if (!res.ok) {
          console.error("Backend returned error:", await res.text());
          return false;
        }

        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },

    async redirect({ url, baseUrl }) {
      return "/dashboard"; 
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
