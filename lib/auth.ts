import NextAuth from "next-auth";

export const { handler, GET, POST } = NextAuth({
  providers: [],
});
