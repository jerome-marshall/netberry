import { formatAccount } from "./../../serverUtils";
import { z } from "zod";
import type { NetlifySite } from "../../../types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { exclude, handleError } from "../../serverUtils";

export const siteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { prisma, axios } }) => {
    try {
      const accounts = await prisma.netlifyAccount.findMany();
      if (accounts) {
        const sites = accounts.map(async (account) => {
          const res = await axios.get<NetlifySite[]>("/sites", {
            headers: { Authorization: `Bearer ${account.token}` },
          });
          const frAccount = formatAccount(account);
          return { account: frAccount, sites: res.data };
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

  getByAccount: publicProcedure
    .input(
      z.object({
        account_slug: z.string(),
        site_id: z.string(),
      })
    )
    .query(
      async ({ ctx: { axios, prisma }, input: { account_slug, site_id } }) => {
        try {
          const account = await prisma.netlifyAccount.findUnique({
            where: { slug: account_slug },
          });
          if (account) {
            const res = await axios.get<NetlifySite>(`/sites/${site_id}`, {
              headers: { Authorization: `Bearer ${account.token}` },
            });
            const frAccount = formatAccount(account);
            return { account: frAccount, site: res.data };
          }
        } catch (error) {
          handleError(error);
        }
      }
    ),
});
