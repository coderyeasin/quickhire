import { loginValidation } from "@/components/Auth/Login/LoginValidators";
import { UserModel } from "@/modules/user/user.model";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "./mongodb";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        name: { type: "text" },
        email: { type: "email" },
        password: { type: "password" },
        avatar: { type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        await connectToDB();

        const validatorsLogin = loginValidation.safeParse(credentials);
        if (!validatorsLogin.success) return null;
        const { email, password, name, avatar } = validatorsLogin.data;

        const user = await UserModel.findOne({ email });

        if (!user || !user.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "candidate" | "admin";
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
});
