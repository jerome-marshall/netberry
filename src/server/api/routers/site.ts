import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { SiteWithAccount } from "../../../types";
import {
  getAllAccounts,
  getAllSites,
  getSiteEnv,
  handleError,
} from "../../serverUtils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { AccountNoToken } from "./../../../types.d";
import { getAccountBySlug, getSiteByID } from "./../../serverUtils";

export const siteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { session } }) => {
    try {
      const { accounts, accountsNoToken } = await getAllAccounts();

      const data = await Promise.all(
        accounts.map(async (account, i) => {
          const sites = await getAllSites({ account_token: account.token });

          const accountNoToken = accountsNoToken[i] as AccountNoToken;

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

          sitesWithAccount.sort((a, b) => {
            if (
              a.published_deploy?.published_at &&
              b.published_deploy?.published_at
            ) {
              return (
                new Date(b.published_deploy.published_at).getTime() -
                new Date(a.published_deploy.published_at).getTime()
              );
            }
            return 0;
          });

          return { sites: sitesWithAccount, account: accountNoToken };
        })
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  }),

  getByAccount: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        site_id: z.string(),
      })
    )
    .query(async ({ input: { account_slug, site_id }, ctx: { session } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });
        const site = await getSiteByID({
          site_id,
          account_token,
        });

        const isFavourite = !!session.user.favSites?.find(
          (favSite) => favSite.site_id === site_id
        );

        const siteWithAccount: SiteWithAccount = {
          ...site,
          account: accountNoToken,
          isFavourite,
        };

        return { site: siteWithAccount };
      } catch (error) {
        handleError(error);
      }
    }),

  getEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        site_account_slug: z.string(),
        site_id: z.string(),
      })
    )
    .query(async ({ input: { account_slug, site_id, site_account_slug } }) => {
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });
        const envs = await getSiteEnv({
          site_id,
          account_token,
          account_slug: site_account_slug,
        });
        return envs;
      } catch (error) {
        handleError(error);
      }
    }),

  addFavorite: protectedProcedure
    .input(
      z.object({
        site_id: z.string(),
        account_slug: z.string(),
      })
    )
    .mutation(
      async ({
        input: { site_id, account_slug },
        ctx: { session, prisma },
      }) => {
        try {
          const user = session.user;
          const favSites = user.favSites || [];
          const siteExists = favSites.find(
            (favSite) => favSite.site_id === site_id
          );

          if (siteExists) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Site already exists in favorites",
            });
          }

          const { account_token } = await getAccountBySlug({
            slug: account_slug,
          });

          const updateSite = await prisma.user.update({
            where: { id: user.id },
            data: {
              favSites: [...favSites, { site_id, account_token, account_slug }],
            },
          });
          console.log(
            "🚀 ~ file: site.ts:110 ~ .mutation ~ updateSite:",
            updateSite
          );

          return updateSite;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  removeFavorite: protectedProcedure
    .input(
      z.object({
        site_id: z.string(),
      })
    )
    .mutation(async ({ input: { site_id }, ctx: { session, prisma } }) => {
      try {
        const user = session.user;
        const favSites = user.favSites || [];
        const siteExists = favSites.find(
          (favSite) => favSite.site_id === site_id
        );

        if (!siteExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Site does not exist in favorites",
          });
        }

        const updateSite = await prisma.user.update({
          where: { id: user.id },
          data: {
            favSites: favSites.filter((favSite) => favSite.site_id !== site_id),
          },
        });
        console.log(
          "🚀 ~ file: site.ts:110 ~ .mutation ~ updateSite:",
          updateSite
        );

        return updateSite;
      } catch (error) {
        handleError(error);
      }
    }),

  getFavorites: protectedProcedure.query(async ({ ctx: { session } }) => {
    try {
      const user = session.user;
      const favSites = user.favSites || [];

      const data = await Promise.all(
        favSites.map(async (favSite) => {
          const site = await getSiteByID(favSite);

          const account = await getAccountBySlug({
            slug: favSite.account_slug,
          });

          const siteWithAccount: SiteWithAccount = {
            ...site,
            account: account.accountNoToken,
          };

          return siteWithAccount;
        })
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  }),
});
