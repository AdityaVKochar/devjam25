import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, user, token }) {
      if (session && typeof session === "object") {
        // @ts-ignore
        if (!session.user) session.user = {} as any;
        // @ts-ignore
        session.user.id = user?.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        if (!url) return baseUrl;
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        if (url.startsWith(baseUrl)) return url;
        return baseUrl;
      } catch (e) {
        return baseUrl;
      }
    },
  },
});

export { handler as GET, handler as POST };
