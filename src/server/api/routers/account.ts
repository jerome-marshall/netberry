import { z } from "zod";
import type { SiteWithAccount } from "../../../types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getAccountBySlug,
  getAllAccounts,
  getAllSites,
  handleError,
} from "./../../serverUtils";

export const accountRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      const { accountsNoToken } = await getAllAccounts();
      return accountsNoToken;
    } catch (error) {
      handleError(error);
    }
  }),

  getSites: publicProcedure
    .input(
      z.object({
        account_slug: z.string(),
      })
    )
    .query(async ({ input: { account_slug } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });
        const sites = await getAllSites({ account_token });

        const sitesWithAccount: SiteWithAccount[] = sites.map((site) => ({
          ...site,
          account: accountNoToken,
        }));

        return { account: accountNoToken, sites: sitesWithAccount };
      } catch (error) {
        handleError(error);
      }
    }),
});
