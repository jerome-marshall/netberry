import { Prisma } from "@prisma/client";
import "@total-typescript/ts-reset";
import { TRPCError } from "@trpc/server";
import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import axios from "axios";
import _, { isEmpty } from "lodash";
import type { GetServerSidePropsContext } from "next";
import _slugify from "slugify";
import { env } from "src/env/server.mjs";
import type {
  AccountCustom,
  BuildTriggerRes,
  GitHubRepo,
  GithubRes,
  NetlifyDeploy,
  NetlifyHook,
  Site,
  SiteEnv,
} from "../types";
import type { AccountNoToken } from "./../types.d";
import { axiosInstance } from "./api/trpc";
import { getServerAuthSession } from "./auth";
import { prisma } from "./db";
import type { z } from "zod";
import type { envSchema } from "@/utils/schemas";

export const getAllAccounts = async () => {
  const accounts = await prisma.netlifyAccount.findMany();

  if (!_.isEmpty(accounts)) {
    const accountsNoToken = accounts.map((account) => formatAccount(account));
    return { accounts, accountsNoToken };
  } else {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No accounts found",
    });
  }
};

export const getAccountBySlug = async ({ slug }: { slug?: string }) => {
  if (!slug) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Account not found",
    });
  }

  const account = await prisma.netlifyAccount.findUnique({
    where: { slug },
  });

  if (account) {
    const account_token = account.token;
    const accountNoToken = formatAccount(account);

    return { account_token, accountNoToken };
  } else {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Account not found",
    });
  }
};

export const getAllSites = async ({
  account_token,
}: {
  account_token: string;
}) => {
  const res = await axiosInstance.get<Site[]>("/sites?page=1", {
    headers: { Authorization: `Bearer ${account_token}` },
  });

  const sites = res.data;

  const allSites = await getNextData<Site>({
    account_token,
    data: sites,
    headers: res.headers,
  });

  return allSites;
};

export const getAllRepoTemplates = async () => {
  const res = await axios.get<GithubRes>(
    "https://api.github.com/search/repositories?q=gatsby-theme-starberry",
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!isEmpty(res.data.items)) {
    return res.data.items;
  }

  return [];
};

export const createRepo = async ({
  repoName,
  siteName,
  templateRepo,
}: {
  repoName: string;
  siteName: string;
  templateRepo: string;
}) => {
  const owner = "starberry";

  const res = await axios.post<GitHubRepo>(
    "https://api.github.com/repos/" + owner + "/" + templateRepo + "/generate",
    {
      owner,
      name: repoName,
      description: `Starberry site - ${siteName}`,
      include_all_branches: true,
      private: true,
    },
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    }
  );

  return res.data;
};

export const createSite = async ({
  domain,
  netlifyToken,
  repoName,
  siteName,
  repoBranch,
}: {
  repoName: string;
  repoBranch: string;
  domain: string;
  siteName: string;
  netlifyToken: string;
}) => {
  const body = {
    name: siteName,
    // domain_aliases: domain,
    custom_domain: domain,
    repo: {
      provider: "github",
      repo: repoName,
      private: true,
      branch: repoBranch,
      owner_type: "User",
      cmd: "yarn build",
      dir: "public",
      base: null,
      installation_id: `${env.GITHUB_INSTALLATION_ID}`,
    },
    build_settings: {
      base_rel_dir: true,
      cmd: "yarn build",
      dir: "public",
    },
  };

  const res = await axiosInstance.post<Site>(
    "/sites",
    { ...body },
    {
      headers: { Authorization: `Bearer ${netlifyToken}` },
    }
  );
  return res.data;
};

export const createBuildHook = async ({
  site_id,
  account_token,
  hookName,
  gitBranch,
}: {
  site_id: string;
  account_token: string;
  hookName: string;
  gitBranch: string;
}) => {
  const res = await axiosInstance.post<NetlifyHook>(
    `/sites/${site_id}/build_hooks`,
    {
      title: hookName,
      branch: gitBranch,
    },
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );
  return res.data;
};

export const getSiteByID = async ({
  site_id,
  account_token,
}: {
  site_id: string;
  account_token: string;
}) => {
  const res = await Promise.all([
    axiosInstance.get<Site>(`/sites/${site_id}`, {
      headers: { Authorization: `Bearer ${account_token}` },
    }),
  ]);

  const site = res?.[0].data;

  if (site) {
    return site;
  } else {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Site not found",
    });
  }
};

export const getSiteEnvs = async ({
  site_id,
  account_token,
  account_slug,
}: {
  site_id?: string;
  account_token?: string;
  account_slug?: string;
}) => {
  if (!site_id || !account_token || !account_slug) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Site not found",
    });
  }

  const res = await axiosInstance.get<SiteEnv[]>(
    `/accounts/${account_slug}/env`,
    {
      headers: { Authorization: `Bearer ${account_token}` },
      params: { site_id, context_name: "production" },
    }
  );

  if (res.data) {
    const envObjArr = res.data.map((env) => ({
      key: env.key,
      value: env.values[0]?.value,
    }));

    // Remove empty values
    const envObjArrFiltered = envObjArr.filter(
      (env) => env.value !== undefined
    );

    // sort alphabetically
    envObjArrFiltered.sort((a, b) =>
      a.key < b.key ? -1 : a.key > b.key ? 1 : 0
    );

    // convert to object
    const envObj = Object.fromEntries(
      envObjArrFiltered.map((env) => [env.key, env.value])
    );

    return envObj;
  }
};

export const getSiteEnv = async ({
  site_id,
  account_token,
  account_slug,
  key,
}: {
  site_id?: string;
  account_token?: string;
  account_slug?: string;
  key: string;
}) => {
  if (!site_id || !account_token || !account_slug) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Site not found",
    });
  }

  const res = await axiosInstance.get<SiteEnv>(
    `/accounts/${account_slug}/env/${key}?site_id=${site_id}`,
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );

  if (res.data) {
    return res.data;
  }
};

export const updateSiteEnv = async ({
  site_id,
  account_token,
  account_slug,
  env,
  key,
}: {
  site_id?: string;
  account_token?: string;
  account_slug?: string;
  env: SiteEnv;
  key: string;
}) => {
  if (!site_id || !account_token || !account_slug) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Site not found",
    });
  }

  const res = await axiosInstance.put<SiteEnv[]>(
    `/accounts/${account_slug}/env/${key}?site_id=${site_id}`,
    env,
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );

  if (res.data) {
    return res.data;
  }
};

export const addEnvs = async ({
  netlify_account_id,
  siteId,
  account_token,
  envs,
}: {
  netlify_account_id: string;
  siteId: string;
  account_token: string;
  envs: z.infer<typeof envSchema>[];
}) => {
  const res = await axiosInstance.post<SiteEnv[]>(
    `/accounts/${netlify_account_id}/env?site_id=${siteId}`,
    envs,
    { headers: { Authorization: `Bearer ${account_token}` } }
  );

  return res.data;
};

export const deleteSiteEnv = async ({
  site_id,
  account_token,
  netlify_account_id,
  key,
}: {
  site_id?: string;
  account_token?: string;
  netlify_account_id?: string;
  key: string;
}) => {
  if (!site_id || !account_token || !netlify_account_id) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Site not found",
    });
  }

  const res = await axiosInstance.delete<{
    code: number;
    message: string;
  }>(`/accounts/${netlify_account_id}/env/${key}?site_id=${site_id}`, {
    headers: { Authorization: `Bearer ${account_token}` },
  });

  if (res.data) {
    return res.data;
  }
};

export const getAllDeploys = async ({
  site_id,
  account_token,
}: {
  site_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.get<NetlifyDeploy[]>(
    `/sites/${site_id}/deploys`,
    { headers: { Authorization: `Bearer ${account_token}` } }
  );
  const data = res.data;
  return data;
};

export const triggerBuild = async ({
  clear_cache,
  site_id,
  account_token,
}: {
  clear_cache: boolean;
  site_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.post<BuildTriggerRes>(
    `/sites/${site_id}/builds`,
    {
      clear_cache,
    },
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );
  return res.data;
};

export const cancelDeploy = async ({
  deploy_id,
  account_token,
}: {
  deploy_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.post<BuildTriggerRes>(
    `/deploys/${deploy_id}/cancel`,
    {},
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );
  return res.data;
};

export const lockDeploy = async ({
  deploy_id,
  account_token,
}: {
  deploy_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.post<BuildTriggerRes>(
    `/deploys/${deploy_id}/lock`,
    {},
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );
  return res.data;
};

export const unlockDeploy = async ({
  deploy_id,
  account_token,
}: {
  deploy_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.post<BuildTriggerRes>(
    `/deploys/${deploy_id}/unlock`,
    {},
    {
      headers: { Authorization: `Bearer ${account_token}` },
    }
  );
  return res.data;
};

const getNextData = async <T>({
  account_token,
  data,
  headers,
}: {
  account_token: string;
  data: T[];
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders;
}) => {
  if (typeof headers.get === "function") {
    const link = headers?.get("link")?.toString();
    if (link) {
      const links = link.split(",");
      if (!_.isEmpty(links)) {
        const firstLink = links[0];

        if (firstLink?.includes('rel="next"')) {
          const nextLink = firstLink
            .split(";")[0]
            ?.replace("<", "")
            .replace(">", "");

          if (nextLink) {
            const resNext = await axiosInstance.get<T[]>(nextLink, {
              headers: { Authorization: `Bearer ${account_token}` },
            });
            const nextData = resNext.data;

            return [...data, ...nextData];
          }
        }
      }
    }
  }
  return data;
};

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);

      if (error.response.status === 401) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      if (error.response.status === 404) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });
      }
      if (error.response.status === 422) {
        let message: string | undefined;

        if ("errors" in error.response.data) {
          message = (
            (error.response?.data as Record<string, unknown>)
              ?.errors as string[]
          )?.[0];
        }

        throw new TRPCError({
          code: "CONFLICT",
          message: "Conflict" + (message ? " - " + message : ""),
        });
      }

      if (error.response.status === 500) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server Error",
        });
      }

      if (error.response.status === 502) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Bad Gateway",
        });
      }

      if (error.response.status === 503) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Service Unavailable",
        });
      }

      if (error.response.status === 504) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gateway Timeout",
        });
      }
    } else if (error.request) {
      console.error(error.request);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Server Error",
      });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error.message);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Server Error - Prisma - " + error.message,
      });
    }

    console.error(error.config);
  }
  if (error instanceof TRPCError) {
    throw error;
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Server Error",
  });
};

export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

export const slugify = (str: string | undefined): string => {
  if (!str) return "";

  const formattedString = str
    .replace(/[$&+,:;=?@#|'<>.^*()%!~`-]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  return _slugify(formattedString);
};

export function addSlug<T, K extends keyof T>(
  obj: T,
  key: K
): T & { slug: string } {
  const slug = slugify(obj[key] as string);
  return { ...obj, slug };
}

export const formatAccount = (account: AccountCustom): AccountNoToken => {
  const accountNoToken = exclude(_.cloneDeep(account), ["token"]);
  // return addSlug(accountNoToken, "name");
  return accountNoToken;
};

export const getServerSidePropsHelper = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
