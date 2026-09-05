import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";
import {
  findCreateOAuthUser,
  getUserByEmail,
} from "@/modules/user/user.service";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await getUserByEmail(credentials.email as string);

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          company: user.company,
          avatar: user.avatar,
          role: user.role,
          recruiterProfile: user.recruiterProfile,
          createdAt: user.createdAt,
        };
      },
    }),

    // Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const dbUser = await findCreateOAuthUser({
            name: user.name as string,
            email: user.email as string,
            avatar: (user.image as string) ?? undefined,
          });
          if (dbUser && dbUser._id) {
            user.id = dbUser._id.toString();
            user.role = dbUser.role;
            user.recruiterProfile = dbUser.recruiterProfile;
            return false;
          }
          console.error(
            "Google login: User could not be found or created in DB",
          );
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.company = user.company;
        token.avatar = user.avatar;
        token.recruiterProfile = user.recruiterProfile;
        token.createdAt = user.createdAt;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.name = token.name as string;
        session.user.company = token.company as string;
        session.user.email = token.email as string;
        session.user.avatar = token.avatar as string;
        session.user.recruiterProfile = token.recruiterProfile;
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
