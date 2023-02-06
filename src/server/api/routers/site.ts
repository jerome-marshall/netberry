import { z } from "zod";
import type { NetlifySite } from "../../../types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { handleError } from "./../../../utils/utils";

export const siteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { prisma, axios } }) => {
    try {
      const accounts = await prisma.netlifyAccount.findMany();
      if (accounts) {
        const sites = accounts.map(async (account) => {
          const res = await axios.get<NetlifySite[]>("/sites", {
            headers: { Authorization: `Bearer ${account.token}` },
          });
          const { token, ...restAccount } = account;
          return { account: restAccount, sites: res.data };
        });

        const resolvedSites = await Promise.all(sites);
        return resolvedSites;
      }
    } catch (error) {
      handleError(error);
    }
  }),

  getByID: publicProcedure
    .input(
      z.object({
        site_id: z.string(),
      })
    )
    .query(async ({ ctx: { axios }, input: { site_id } }) => {
      try {
        const res = await axios.get<NetlifySite>(`/sites/${site_id}`);
        return res.data;
      } catch (error) {
        handleError(error);
      }
    }),
});
