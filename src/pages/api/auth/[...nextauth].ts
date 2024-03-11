import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";

import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const adminEmails = ["tchindjeeric61@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise) as Adapter,

  callbacks: {
    async session({ session, token, user }) {
      const email = session.user?.email;
      if (email && adminEmails.includes(email)) {
        return session;
      }
      throw new Error("unauthorized. Only the admin is authorized!");
    },
  },
};

export default NextAuth(authOptions);

export const isAdminRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  if (!(email && adminEmails.includes(email))) {
    res
      .status(401)
      .send({ message: "unauthorized. Only the Admin is authorized!" });
    throw new Error("Not an Admin");
  }
};
