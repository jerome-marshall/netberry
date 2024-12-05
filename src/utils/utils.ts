import { type ClassValue, clsx } from "clsx";
import type { ENVKeyValue } from "src/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertStringToEnvKeyValue = (input: string): ENVKeyValue[] => {
  const lines = input.trim().split("\n");
  const keyValuePairs: ENVKeyValue[] = [];

  lines.forEach((line) => {
    const [key, ...values] = line.split("=");
    const formattedValues = values.map((value) => ({
      value: value.trim(),
      context: "all",
    }));

    if (key && values.length) {
      keyValuePairs.push({ key: key.trim(), values: formattedValues });
    }
  });

  return keyValuePairs;
};

export async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value);
}
