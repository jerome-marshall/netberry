import { siteRouter } from "./routers/site";
import { createTRPCRouter } from "./trpc";
import { deployRouter } from "./routers/deploy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  site: siteRouter,
  deploy: deployRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
