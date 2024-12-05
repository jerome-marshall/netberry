import { z } from "zod";

export const envSchema = z.object({
  key: z.string(),
  values: z.array(
    z.object({
      value: z.string(),
      context: z.string(),
    })
  ),
});

const validateENVMessage = (val: string) => {
  const lines = val.split("\n");
  const regex = /^([A-Z0-9_]+(?:_[A-Z0-9_]+)*\s*=\s*[^#\r\n]+)$/;

  let message = "Every entry must be in the format: ENV_KEY=VALUE";

  lines.forEach((line) => {
    const [key, value] = line.split("=");

    if (key && !/^[A-Z0-9_]+$/.test(key)) {
      if (key !== key.toUpperCase()) {
        message = `Invalid KEY: ${key} (Must be uppercase)`;
        return;
      }

      message = `Invalid KEY: ${key} (Entry: ${line})`;
      return;
    }

    if (!/^([^#\r\n]+)$/.test(value!)) {
      message = `Invalid VALUE: ${value!}. (Entry: ${line})`;
      return;
    }

    if (!regex.test(line)) {
      message = `${line} entry must be in the format: ENV_KEY=VALUE.`;
      return;
    }
  });

  return { message }; // All lines are valid
};

const validateENV = (val: string) => {
  const lines = val.split("\n");
  const regex = /^([A-Z0-9_]+(?:_[A-Z0-9_]+)*\s*=\s*[^#\r\n]+)$/;

  return lines.every((line) => regex.test(line));
};

export const envStringSchema = z
  .string({
    required_error: "Please enter at least one environment variable",
    invalid_type_error: "Please enter a valid environment variable",
  })
  .min(1, "Please enter at least one environment variable")
  .refine(validateENV, validateENVMessage);

export const createFormSchema = z.object({
  templateRepo: z.string(),
  repoName: z.string().min(3).max(50),
  siteName: z.string().min(3).max(50),
  netlifyAccount: z.string().min(3).max(50),
  domain: z.string().min(3).max(50),
  repoBranch: z.string().min(3).max(50),
  envString: z
    .string()
    .refine((val) => {
      if (!val) return true;
      return validateENV(val);
    }, validateENVMessage)
    .optional(),
  env: z.array(envSchema).optional(),
});
