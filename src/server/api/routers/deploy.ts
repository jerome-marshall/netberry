import { z } from "zod";
import { logAction } from "../../../utils/logger";
import {
  cancelDeploy,
  handleError,
  lockDeploy,
  unlockDeploy,
} from "../../serverUtils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  getAccountBySlug,
  getAllDeploys,
  triggerBuild,
} from "./../../serverUtils";

export const deployRouter = createTRPCRouter({
  getAll: protectedProcedure
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

  triggerBuild: protectedProcedure
    .input(
      z.object({
        clear_cache: z.boolean(),
        site_id: z.string(),
        site_name: z.string(),
        account_slug: z.string(),
      })
    )
    .mutation(
      async ({
        input: { clear_cache, site_id, site_name, account_slug },
        ctx: { session },
      }) => {
        try {
          const { account_token, accountNoToken } = await getAccountBySlug({
            slug: account_slug,
          });
          const res = await triggerBuild({
            clear_cache,
            site_id,
            account_token,
          });

          // log action - trigger build
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `Trigger deploy ${clear_cache ? "- clear cache" : ""}`,
            siteId: site_id,
            siteName: site_name,
            accountId: accountNoToken.id,
            accountName: accountNoToken.name,
            accountSlug: accountNoToken.slug,
            misc: JSON.stringify({
              deployId: res.deploy_id,
            }),
          });

          return res;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  cancelDeploy: protectedProcedure
    .input(
      z.object({
        deploy_id: z.string(),
        account_slug: z.string(),
        site_id: z.string(),
        site_name: z.string(),
      })
    )
    .mutation(
      async ({
        input: { deploy_id, account_slug, site_id, site_name },
        ctx: { session },
      }) => {
        try {
          const { account_token, accountNoToken } = await getAccountBySlug({
            slug: account_slug,
          });
          const res = await cancelDeploy({
            deploy_id,
            account_token,
          });

          // log action - cancel deploy
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `Cancel deploy`,
            siteName: site_name,
            siteId: site_id,
            accountId: accountNoToken.id,
            accountName: accountNoToken.name,
            accountSlug: accountNoToken.slug,
            misc: JSON.stringify({
              deployId: deploy_id,
            }),
          });

          return res;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  lockDeploy: protectedProcedure
    .input(
      z.object({
        deploy_id: z.string(),
        account_slug: z.string(),
        site_id: z.string(),
        site_name: z.string(),
      })
    )
    .mutation(
      async ({
        input: { deploy_id, account_slug, site_name, site_id },
        ctx: { session },
      }) => {
        try {
          const { account_token, accountNoToken } = await getAccountBySlug({
            slug: account_slug,
          });
          const res = await lockDeploy({
            deploy_id,
            account_token,
          });

          // log action - lock deploy
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `Lock deploy`,
            siteName: site_name,
            siteId: site_id,
            accountId: accountNoToken.id,
            accountName: accountNoToken.name,
            accountSlug: accountNoToken.slug,
            misc: JSON.stringify({
              deployId: deploy_id,
            }),
          });

          return res;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  unlockDeploy: protectedProcedure
    .input(
      z.object({
        deploy_id: z.string(),
        account_slug: z.string(),
        site_id: z.string(),
        site_name: z.string(),
      })
    )
    .mutation(
      async ({
        input: { deploy_id, account_slug, site_id, site_name },
        ctx: { session },
      }) => {
        try {
          const { account_token, accountNoToken } = await getAccountBySlug({
            slug: account_slug,
          });
          const res = await unlockDeploy({
            deploy_id,
            account_token,
          });

          // log action - unlock deploy
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `Unlock deploy`,
            siteName: site_name,
            siteId: site_id,
            accountId: accountNoToken.id,
            accountName: accountNoToken.name,
            accountSlug: accountNoToken.slug,
            misc: JSON.stringify({
              deployId: deploy_id,
            }),
          });

          return res;
        } catch (error) {
          handleError(error);
        }
      }
    ),
});
