import { createFormSchema } from "@/utils/schemas";
import {
  createBuildHook,
  createRepo,
  createSite,
  getAccountBySlug,
  getAllRepoTemplates,
  handleError,
} from "../../serverUtils";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { logAction } from "@/utils/logger";

export const adminRouter = createTRPCRouter({
  getRepoTemplates: adminProcedure.query(async () => {
    try {
      const repos = await getAllRepoTemplates();
      return repos;
    } catch (error) {
      handleError(error);
    }
  }),

  createRepo: adminProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        const data = await createRepo(input);

        logAction({
          userName: session.user.name,
          email: session.user.email,
          action: "Create Repo",
          misc: JSON.stringify(input),
          accountSlug: input.netlifyAccount,
        });

        return {
          ...data,
          input: {
            ...input,
            repoName: data.full_name,
          },
        };
      } catch (error) {
        handleError(error);
      }
    }),

  createNetlifySite: adminProcedure
    .input(createFormSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: input.netlifyAccount,
        });

        const data = await createSite({
          ...input,
          netlifyToken: account_token,
        });

        const hook = await createBuildHook({
          account_token,
          site_id: data.id,
          gitBranch: "live",
          hookName: "Build Hook",
        });

        logAction({
          userName: session.user.name,
          email: session.user.email,
          action: "Create Site",
          misc: JSON.stringify(input),
          siteId: data.id,
          accountSlug: input.netlifyAccount,
        });

        return { ...input, account: accountNoToken, site: data, hook };
      } catch (error) {
        handleError(error);
      }
    }),
});
