import { TRPCError } from "@trpc/server";
import axios from "axios";
import _ from "lodash";
import _slugify from "slugify";
import type { NetlifyAccountCustom, NetlifySite } from "../types";
import type { NetlifyAccountNoToken } from "./../types.d";
import { prisma } from "./db";

export const getAllAccounts = async () => {
  const accounts = await prisma.netlifyAccount.findMany();
  const formattedAccs = accounts.map((account) => formatAccount(account));
  if (!_.isEmpty(formattedAccs)) {
    return formattedAccs;
  } else {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No accounts found",
    });
  }
};

export const getAccountBySlug = async (slug: string) => {
  const account = await prisma.netlifyAccount.findUnique({
    where: { slug },
  });
  if (account) {
    const frAccount = formatAccount(account);
    return frAccount;
  } else {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Account not found",
    });
  }
};

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
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

export const formatAccount = (
  account: NetlifyAccountCustom
): NetlifyAccountNoToken => {
  const accountNoToken = exclude(account, ["token"]);
  // return addSlug(accountNoToken, "name");
  return accountNoToken;
};
