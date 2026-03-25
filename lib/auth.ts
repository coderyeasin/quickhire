import { loginValidation } from "@/components/Auth/Login/LoginValidators";
import { UserModel } from "@/modules/user/user.model";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { email } from "zod";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const validatorsLogin = loginValidation.parse(credentials);
        if (validatorsLogin.email) {
          user = await UserModel.findOne({
            where: {
              email: validatorsLogin.email,
            },
          });
        }
      },
    }),
  ],
  pages: {
    error: "/login",
  },
});
