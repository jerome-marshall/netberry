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
});
