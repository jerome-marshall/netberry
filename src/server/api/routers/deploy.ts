import { z } from "zod";
import { handleError } from "../../../utils/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { NetlifyDeploy } from "./../../../types";

export const deployRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ site_id: z.string() }))
    .query(async ({ ctx: { axios }, input: { site_id } }) => {
      try {
        const res = await axios.get<NetlifyDeploy>(`/sites/${site_id}/deploys`);
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
        const res = await axios.post(`/sites/${site_id}/builds`, {
          clear_cache,
        });
        console.log("🚀 ~ file: deploy.ts:30 ~ .mutation ~ res", res);
        return res;
      } catch (error) {
        handleError(error);
      }
    }),
});
