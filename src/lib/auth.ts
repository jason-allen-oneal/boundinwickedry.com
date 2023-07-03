/* eslint-disable */
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify, hash } from "argon2";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { loginSchema } from "./validation/auth";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        try {
          const { email, password } = await loginSchema.validate(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
            include: {
              UserSettings: true,
            }
          });
          
          if (!result) return null;

          const isValidPassword = await verify(
            result.password,
            password as string
          );

          if (!isValidPassword) return null;

          return result;
        } catch (e) {
          console.log("error", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        console.log('lib/auth user', user);
        token.id = user.id as number;
        token.email = user.email as string;
        token.name = user.name;
        token.avatar = user.avatar;
        token.joined = user.joined;
        token.subtype = user.subtype;
        token.verified = user.verified;
        token.admin = user.admin;
        token.slug = user.slug;
        token.bio = user.bio;
        token.socket = user.socket;
        token.chat = user.chat;
        token.perPage = user.UserSettings.perPage;
        token.sort = user.UserSettings.sort;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/user/login",
    newUser: "/user/register",
  },
  secret: "$0|/|37]-[!||9//!c|<3d",
};
