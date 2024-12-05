import { envSchema } from "@/utils/schemas";
import { TRPCError } from "@trpc/server";
import fs from "fs";
import { z } from "zod";
import type { SiteEnv, SiteWithAccount } from "../../../types";
import { logAction } from "../../../utils/logger";
import {
  addEnvs,
  deleteSiteEnv,
  getAllAccounts,
  getAllSites,
  getSiteEnv,
  getSiteEnvs,
  handleError,
  triggerBuild,
  updateSiteEnv,
} from "../../serverUtils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { AccountNoToken } from "./../../../types.d";
import { getAccountBySlug, getSiteByID } from "./../../serverUtils";
import { env } from "src/env/server.mjs";

export const siteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { session } }) => {
    try {
      const { accounts, accountsNoToken } = await getAllAccounts();

      const data = await Promise.all(
        accounts.map(async (account, i) => {
          const sites = await getAllSites({ account_token: account.token });

          const accountNoToken = accountsNoToken[i] as AccountNoToken;

          const sitesWithAccount: SiteWithAccount[] = sites.map((site) => {
            const isFavourite = !!session.user.favSites?.find(
              (favSite) => favSite.site_id === site.site_id
            );

            return {
              ...site,
              account: accountNoToken,
              isFavourite,
            };
          });

          sitesWithAccount.sort((a, b) => {
            if (
              a.published_deploy?.published_at &&
              b.published_deploy?.published_at
            ) {
              return (
                new Date(b.published_deploy.published_at).getTime() -
                new Date(a.published_deploy.published_at).getTime()
              );
            }
            return -1;
          });

          return { sites: sitesWithAccount, account: accountNoToken };
        })
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  }),

  getByAccount: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        site_id: z.string(),
      })
    )
    .query(async ({ input: { account_slug, site_id }, ctx: { session } }) => {
      try {
        const { account_token, accountNoToken } = await getAccountBySlug({
          slug: account_slug,
        });
        const site = await getSiteByID({
          site_id,
          account_token,
        });

        const isFavourite = !!session.user.favSites?.find(
          (favSite) => favSite.site_id === site_id
        );

        const siteWithAccount: SiteWithAccount = {
          ...site,
          account: accountNoToken,
          isFavourite,
        };

        return { site: siteWithAccount };
      } catch (error) {
        handleError(error);
      }
    }),

  getEnvs: protectedProcedure
    .input(
      z.object({
        account_slug: z.string().optional(),
        site_account_slug: z.string().optional(),
        site_id: z.string().optional(),
      })
    )
    .query(async ({ input: { account_slug, site_id, site_account_slug } }) => {
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });
        const envs = await getSiteEnvs({
          site_id,
          account_token,
          account_slug: site_account_slug,
        });
        return envs;
      } catch (error) {
        handleError(error);
      }
    }),

  updateEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string().optional(),
        site_account_slug: z.string().optional(),
        site_id: z.string().optional(),
        env: z.object({
          newKey: z.string().optional(),
          key: z.string(),
          value: z.string().optional(),
        }),
      })
    )
    .mutation(
      async ({
        input: { account_slug, site_id, site_account_slug, env },
        ctx: { session },
      }) => {
        try {
          const { account_token } = await getAccountBySlug({
            slug: account_slug,
          });
          const envData = await getSiteEnv({
            site_id,
            account_token,
            account_slug: site_account_slug,
            key: env.key,
          });

          if (envData) {
            const toUpdateEnv: SiteEnv = {
              ...envData,
              key: env.newKey || env.key,
              values: envData.values.map((value) => ({
                ...value,
                value: env.value || value.value,
              })),
            };
            const updatedEnv = await updateSiteEnv({
              site_id,
              account_token,
              account_slug: site_account_slug,
              env: toUpdateEnv,
              key: env.key,
            });

            logAction({
              userName: session.user.name,
              email: session.user.email,
              action: "Update Env",
              misc: JSON.stringify(env),
              siteId: site_id,
              accountSlug: account_slug,
            });

            return updatedEnv;
          }
        } catch (error) {
          handleError(error);
        }
      }
    ),

  deleteEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string().optional(),
        netlify_account_id: z.string().optional(),
        site_id: z.string().optional(),
        key: z.string(),
      })
    )
    .mutation(
      async ({
        input: { account_slug, site_id, netlify_account_id, key },
        ctx: { session },
      }) => {
        try {
          const { account_token } = await getAccountBySlug({
            slug: account_slug,
          });

          const res = await deleteSiteEnv({
            site_id,
            account_token,
            netlify_account_id,
            key,
          });

          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: "Delete Env",
            misc: JSON.stringify({ key }),
            siteId: site_id,
            accountSlug: account_slug,
          });

          return res;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  addFavorite: protectedProcedure
    .input(
      z.object({
        site_id: z.string(),
        account_slug: z.string(),
      })
    )
    .mutation(
      async ({
        input: { site_id, account_slug },
        ctx: { session, prisma },
      }) => {
        try {
          const user = session.user;
          const favSites = user.favSites || [];
          const siteExists = favSites.find(
            (favSite) => favSite.site_id === site_id
          );

          if (siteExists) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Site already exists in favorites",
            });
          }

          const { account_token } = await getAccountBySlug({
            slug: account_slug,
          });

          const updateSite = await prisma.user.update({
            where: { id: user.id },
            data: {
              favSites: [...favSites, { site_id, account_token, account_slug }],
            },
          });

          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: "Add Favorite Site",
            siteId: site_id,
            accountSlug: account_slug,
          });

          return updateSite;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  removeFavorite: protectedProcedure
    .input(
      z.object({
        site_id: z.string(),
      })
    )
    .mutation(async ({ input: { site_id }, ctx: { session, prisma } }) => {
      try {
        const user = session.user;
        const favSites = user.favSites || [];
        const siteExists = favSites.find(
          (favSite) => favSite.site_id === site_id
        );

        if (!siteExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Site does not exist in favorites",
          });
        }

        const updateSite = await prisma.user.update({
          where: { id: user.id },
          data: {
            favSites: favSites.filter((favSite) => favSite.site_id !== site_id),
          },
        });

        logAction({
          userName: session.user.name,
          email: session.user.email,
          action: "Remove Favorite Site",
          siteId: site_id,
          accountSlug: siteExists.account_slug,
        });

        return updateSite;
      } catch (error) {
        handleError(error);
      }
    }),

  getFavorites: protectedProcedure.query(async ({ ctx: { session } }) => {
    try {
      const user = session.user;
      const favSites = user.favSites || [];

      const data = await Promise.all(
        favSites.map(async (favSite) => {
          const site = await getSiteByID(favSite);

          const account = await getAccountBySlug({
            slug: favSite.account_slug,
          });

          const siteWithAccount: SiteWithAccount = {
            ...site,
            account: account.accountNoToken,
          };

          return siteWithAccount;
        })
      );

      return data;
    } catch (error) {
      handleError(error);
    }
  }),

  getEnvFile: protectedProcedure
    .input(
      z.object({
        site_name: z.string(),
        envs: z.record(z.string().optional()),
      })
    )
    .query(({ input: { site_name, envs } }) => {
      try {
        let stream: Buffer = Buffer.from("");
        const path =
          env.NODE_ENV === "production"
            ? `/tmp/${site_name}.env`
            : `./${site_name}.env`;

        const envFile = Object.entries(envs)
          .map(([key, value]) => `${key}=${value || ""}`)
          .join("\n");

        try {
          fs.writeFileSync(path, envFile);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error writing file",
          });
        }

        try {
          stream = fs.readFileSync(path);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error reading file",
          });
        }

        try {
          fs.unlinkSync(path);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error deleting file",
          });
        }

        return stream.toString("base64");
      } catch (error) {
        handleError(error);
      }
    }),

  downloadEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        account_name: z.string(),
        account_id: z.string(),
        site_id: z.string(),
        site_name: z.string(),
      })
    )
    .mutation(
      ({
        input: { account_id, account_name, account_slug, site_id, site_name },
        ctx: { session },
      }) => {
        try {
          // log action - download env
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `Download Env`,
            siteName: site_name,
            siteId: site_id,
            accountId: account_id,
            accountName: account_name,
            accountSlug: account_slug,
          });

          return;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  openEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        account_name: z.string(),
        account_id: z.string(),
        site_id: z.string(),
        site_name: z.string(),
      })
    )
    .mutation(
      ({
        input: { account_id, account_name, account_slug, site_id, site_name },
        ctx: { session },
      }) => {
        try {
          // log action - open env
          logAction({
            userName: session.user.name,
            email: session.user.email,
            action: `View Env`,
            siteName: site_name,
            siteId: site_id,
            accountId: account_id,
            accountName: account_name,
            accountSlug: account_slug,
          });

          return;
        } catch (error) {
          handleError(error);
        }
      }
    ),

  addEnv: protectedProcedure
    .input(
      z.object({
        account_slug: z.string(),
        netlify_account_id: z.string(),
        site_id: z.string(),
        envs: z.array(envSchema),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      const { account_slug, envs, netlify_account_id, site_id } = input;
      try {
        const { account_token } = await getAccountBySlug({
          slug: account_slug,
        });

        const data = await addEnvs({
          account_token,
          envs,
          netlify_account_id,
          siteId: site_id,
        });

        void triggerBuild({
          clear_cache: true,
          site_id,
          account_token,
        });

        logAction({
          userName: session.user.name,
          email: session.user.email,
          action: "Add Env",
          misc: JSON.stringify(envs),
          siteId: site_id,
          accountSlug: account_slug,
        });

        return data;
      } catch (error) {
        handleError(error);
      }
    }),
});
