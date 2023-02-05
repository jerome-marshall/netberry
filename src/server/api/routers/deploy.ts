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
});
