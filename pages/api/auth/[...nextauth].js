import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { CredentialsProvider } from "next-auth/providers";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  session: { strategy: "jwt" },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          const res = await fetch('endpoint', {
            method: 'POST',
            body: 
          }

          )
        } catch (err) {
          return null;
        }
      }
    })
  ]
}

export default NextAuth(authOptions);