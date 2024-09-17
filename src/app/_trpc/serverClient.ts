import { appRouter } from "@/server";
import { createCallerFactory } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({});

export const serverClient = caller;

type QueryKeys = Exclude<
  keyof typeof serverClient,
  "query" | "mutation" | "subscription"
>;

export type ServerTypes<T extends QueryKeys> = Awaited<
  ReturnType<(typeof serverClient)[T]>
>;
