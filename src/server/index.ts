import { userRouter } from "./routes/userRouter";
import { mergeRouters } from "./trpc";

export const appRouter = mergeRouters(userRouter);

export type AppRouter = typeof appRouter;
