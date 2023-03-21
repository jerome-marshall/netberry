import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { SiteWithAccount } from "../../../types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  getAccountBySlug,
  getAllAccounts,
  getAllSites,
  handleError,
} from "./../../serverUtils";

export const accountRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { session } }) => {
    try {
      const { accountsNoToken } = await getAllAccounts();
      const accounts = accountsNoToken.map((account) => {
        const isFavourite = !!session.user.favAccounts?.find(
          (favAccount) => favAccount.id === account.id
        );

        return {
          ...account,
          isFavourite,
        };
      });
      return accounts;
    } catch (error) {
      handleError(error);
    }
  }),

  getSites: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
      })
    )
    .query(async ({ input: { account_slug }, ctx: { session } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });

        const isFav = !!session.user.favAccounts?.find(
          (favAccount) => favAccount.slug === account_slug
        );
        accountNoToken.isFavourite = isFav;

        const sites = await getAllSites({ account_token });
        const sitesWithAccount: SiteWithAccount[] = sites.map((site) => {
          const isFavourite = !!session.user.favSites?.find(
            (favSite) => favSite.site_id === site.site_id
          );
          return {
            ...site,
            account: accountNoToken,
            isFavourite,
          };
        });

        return { account: accountNoToken, sites: sitesWithAccount };
      } catch (error) {
        handleError(error);
      }
    }),

  addFavorite: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
      })
    )
    .mutation(async ({ input: { account_slug }, ctx: { session, prisma } }) => {
      try {
        const favAccounts = session.user.favAccounts || [];

        const isFav = !!favAccounts?.find((favAccount) => {
          return favAccount.slug === account_slug;
        });

        if (isFav) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Account is already in your favorites",
          });
        }

        const { accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });

        const updateAccount = await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            favAccounts: [
              ...favAccounts,
              { ...accountNoToken, isFavourite: true },
            ],
          },
        });

        return updateAccount;
      } catch (error) {
        handleError(error);
      }
    }),

  removeFavorite: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
      })
    )
    .mutation(async ({ input: { account_slug }, ctx: { session, prisma } }) => {
      const favAccounts = session.user.favAccounts || [];

      const isFav = !!favAccounts?.find(
        (favAccount) => favAccount.slug === account_slug
      );

      if (!isFav) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account is not in your favorites",
        });
      }

      const updateAccount = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          favAccounts: favAccounts.filter(
            (favAccount) => favAccount.slug !== account_slug
          ),
        },
      });

      return updateAccount;
    }),

  getFavorites: protectedProcedure.query(({ ctx: { session } }) => {
    try {
      const favAccounts = session.user.favAccounts || [];
      return favAccounts;
    } catch (error) {
      handleError(error);
    }
  }),
});
