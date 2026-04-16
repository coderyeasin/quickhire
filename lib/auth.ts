import { loginValidation } from "@/components/Auth/Login/LoginValidators";
import { UserModel } from "@/modules/user/user.model";
import * as bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "./mongodb";

export const authOptions: NextAuthOptions = NextAuth({
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
        await connectToDB();

        const validatorsLogin = loginValidation.safeParse(credentials);
        if (!validatorsLogin.success) return null;

        const { email, password, name, avatar } = validatorsLogin.data;

        const user = await UserModel.findOne({ email });

        // if (!user || !user.password) return null;
        if (!user && name) {
          const hashedPass = await bcrypt.hash(password, 10);

          const newUser = await UserModel.create({
            name,
            email,
            password: hashedPass,
            avatar: avatar || undefined,
            role: "candidate",
          });
          return {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
          };
        } else if (!user) {
          throw new Error("User not found");
        } else {
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) throw new Error("Invalid credentials");
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          };
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "candidate" | "admin";
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
});
