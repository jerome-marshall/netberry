import {
  WinstonTransport as AxiomTransport,
  Client,
} from "@axiomhq/axiom-node";
import winston from "winston";
import { env } from "../env/server.mjs";

const client = new Client({
  token: env.AXIOM_TOKEN,
  orgId: env.AXIOM_ORG,
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    // You can pass an option here, if you don't the transport is configured
    // using environment variables like `AXIOM_DATASET` and `AXIOM_TOKEN`
    new AxiomTransport({
      dataset: "netberry_actions",
      token: env.AXIOM_TOKEN,
      orgId: env.AXIOM_ORG,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const logAction = (props: {
  userName?: string | null;
  email?: string | null;
  action: string;
  siteName?: string;
  siteId?: string;
  accountId?: string;
  accountName?: string;
  accountSlug?: string;
  description?: string;
  misc?: string;
}) => {
  // logger.info(props);

  if (env.NODE_ENV === "development") return;

  client.ingestEvents("netberry_actions", props).finally(() => null);
};
