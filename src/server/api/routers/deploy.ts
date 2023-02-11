import { z } from "zod";
import { handleError } from "../../serverUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { BuildTriggerRes, NetlifyDeploy } from "./../../../types";

export const deployRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ site_id: z.string() }))
    .query(async ({ ctx: { axios }, input: { site_id } }) => {
      try {
        const res = await axios.get<NetlifyDeploy[]>(
          `/sites/${site_id}/deploys`
        );
        const data = res.data;
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
      })
    )
    .mutation(async ({ ctx: { axios }, input: { clear_cache, site_id } }) => {
      try {
        const res = await axios.post<BuildTriggerRes>(
          `/sites/${site_id}/builds`,
          {
            clear_cache,
          }
        );
        return res.data;
      } catch (error) {
        handleError(error);
      }
    }),
});
