import { formatAccount, handleError } from "./../../serverUtils";
import { z } from "zod";
import type { NetlifySite } from "../../../types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { addSlug, exclude } from "../../serverUtils";

export const accountRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { prisma, axios } }) => {
    try {
      const accounts = await prisma.netlifyAccount.findMany();
      const formattedAccs = accounts.map((account) => formatAccount(account));
      return formattedAccs;
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
    .query(async ({ ctx: { prisma, axios }, input: { account_slug } }) => {
      try {
        const account = await prisma.netlifyAccount.findUnique({
          where: { slug: account_slug },
        });
        if (account) {
          const res = await axios.get<NetlifySite[]>("/sites", {
            headers: { Authorization: `Bearer ${account.token}` },
          });

          const frAccount = formatAccount(account);
          return { account: frAccount, sites: res.data };
        }
      } catch (error) {
        handleError(error);
      }
    }),
});
