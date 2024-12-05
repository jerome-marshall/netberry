import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import type { DefaultUser, Role } from "next-auth";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../env/server.mjs";
import type { AccountNoToken, FavSite } from "../types.js";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Role {
    id: string;
    name: "user" | "admin" | "developer";
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      favSites?: FavSite[];
      favAccounts?: AccountNoToken[];
      roleId?: string;
      role?: Role | null;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    favSites?: FavSite[];
    favAccounts?: AccountNoToken[];
    roleId?: string;
    role?: Role | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!dbUser) {
        throw new Error("User not found");
      }

      let role: Role;

      if (dbUser.roleId) {
        role = (await prisma.role.findFirst({
          where: {
            id: dbUser.roleId,
          },
        })) as Role;
      } else {
        role = {
          id: "cllai59u90000w4ksy549pw7u",
          name: "user",
        };
      }

      if (session.user) {
        session.user.id = user.id;
        session.user.favSites = user.favSites;
        session.user.favAccounts = user.favAccounts;
        session.user.role = role;
      }

      return session;
    },
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!(profile?.email && profile.email.endsWith("@starberry.tv"));
      }
      return false;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
