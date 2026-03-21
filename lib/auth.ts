import NextAuth from "next-auth";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [],
});
