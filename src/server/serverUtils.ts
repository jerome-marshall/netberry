import { NetlifyAccountNoToken } from "./../types.d";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import _slugify from "slugify";
import { NetlifyAccountCustom } from "../types";

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
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
