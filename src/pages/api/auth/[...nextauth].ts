import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";

import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../../lib/mongodb";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise) as Adapter,

  callbacks: {
    async session({ session, token, user }) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
};

export default NextAuth(options);
