import { z } from "zod";
import type { SiteWithAccount } from "../../../types";
import {
  getAllAccounts,
  getAllSites,
  getSiteEnv,
  handleError,
} from "../../serverUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { AccountNoToken } from "./../../../types.d";
import { getAccountBySlug, getSiteByID } from "./../../serverUtils";

export const siteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      const { accounts, accountsNoToken } = await getAllAccounts();

      const data = await Promise.all(
        accounts.map(async (account, i) => {
          const sites = await getAllSites({ account_token: account.token });

          const accountNoToken = accountsNoToken[i] as AccountNoToken;

          const sitesWithAccount: SiteWithAccount[] = sites.map((site) => ({
            ...site,
            account: accountNoToken,
          }));

          return { sites: sitesWithAccount, account: accountNoToken };
        })
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  }),

  getByAccount: publicProcedure
    .input(
      z.object({
        account_slug: z.string(),
        site_id: z.string(),
      })
    )
    .query(async ({ input: { account_slug, site_id } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });
        const site = await getSiteByID({
          site_id,
          account_token,
        });
        const siteWithAccount: SiteWithAccount = {
          ...site,
          account: accountNoToken,
        };
        return { site: siteWithAccount };
      } catch (error) {
        handleError(error);
      }
    }),

  getEnv: publicProcedure
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
});
