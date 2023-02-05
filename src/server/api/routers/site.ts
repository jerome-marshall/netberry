import type { NetlifySite } from "../../../types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { handleError } from "./../../../utils/utils";

export const siteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.axios.get<NetlifySite[]>("/sites");
      const data = res.data;
      return data;
    } catch (error) {
      handleError(error);
    }
  }),
});
