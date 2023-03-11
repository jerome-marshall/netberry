import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import _ from "lodash";
import _slugify from "slugify";
import type {
  AccountCustom,
  BuildTriggerRes,
  NetlifyDeploy,
  Site,
} from "../types";
import type { AccountNoToken } from "./../types.d";
import { axiosInstance } from "./api/trpc";
import { prisma } from "./db";

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

export const getAccountBySlug = async ({ slug }: { slug: string }) => {
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
  const res = await axiosInstance.get<Site[]>("/sites", {
    headers: { Authorization: `Bearer ${account_token}` },
  });
  return res.data;
};

export const getSiteByID = async ({
  site_id,
  account_token,
}: {
  site_id: string;
  account_token: string;
}) => {
  const res = await axiosInstance.get<Site>(`/sites/${site_id}`, {
    headers: { Authorization: `Bearer ${account_token}` },
  });
  return res.data;
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
