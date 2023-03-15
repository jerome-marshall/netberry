import { z } from "zod";
import { cancelDeploy, handleError } from "../../serverUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getAccountBySlug,
  getAllDeploys,
  triggerBuild,
} from "./../../serverUtils";

export const deployRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ site_id: z.string(), account_slug: z.string() }))
    .query(async ({ input: { site_id, account_slug } }) => {
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });
        const data = await getAllDeploys({ site_id, account_token });
        return data;
      } catch (error) {
        handleError(error);
      }
    }),

  triggerBuild: publicProcedure
    .input(
      z.object({
        clear_cache: z.boolean(),
        site_id: z.string(),
        account_slug: z.string(),
      })
    )
    .mutation(async ({ input: { clear_cache, site_id, account_slug } }) => {
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });
        const res = await triggerBuild({
          clear_cache,
          site_id,
          account_token,
        });
        return res;
      } catch (error) {
        handleError(error);
      }
    }),

  cancelDeploy: publicProcedure
    .input(
      z.object({
        deploy_id: z.string(),
        account_slug: z.string(),
      })
    )
    .mutation(async ({ input: { deploy_id, account_slug } }) => {
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });
        const res = await cancelDeploy({
          deploy_id,
          account_token,
        });
        return res;
      } catch (error) {
        handleError(error);
      }
    }),
});
