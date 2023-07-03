import NextAuth, { DefaultSession, JWT, DefaultUser, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      joined: number;
      verified: number;
      subtype: number;
      admin: number;
      avatar: string;
      slug: string;
      email: string;
      bio: string;
      socket: string;
      chat: number;
      perPage: number;
      sort: string;
      UserSettings: any;
    };
  }

  interface User extends Omit<DefaultUser, "id"> {
    id: number;
    name: string;
    joined: number;
    verified: number;
    subtype: number;
    admin: number;
    avatar: string;
    slug: string;
    email: string;
    bio: string;
    socket: string;
    chat: number;
    perPage: number;
    sort: string;
    UserSettings: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    joined: number;
    verified: number;
    subtype: number;
    admin: number;
    avatar: string;
    slug: string;
    email: string;
    bio: string;
    socket: string;
    chat: number;
    perPage: number;
    sort: string;
    UserSettings: any;
  }
}
