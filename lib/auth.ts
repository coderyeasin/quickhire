import { loginValidation } from "@/components/Auth/Login/LoginValidators";
import { UserModel } from "@/modules/user/user.model";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const validatorsLogin = loginValidation.safeParse(credentials);
        if (!validatorsLogin.success) return null;
        const { email, password } = validatorsLogin.data;

        const user = await UserModel.findOne({ email }).exec();

        if (!user || !user.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return user;

        // if (user && user.password) {
        //   const isValid = await compare(password, user.password);
        //   if (!isValid) return null;
        // }
        // if (!user) return null;
        // return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        // session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    error: "/login",
  },
});
