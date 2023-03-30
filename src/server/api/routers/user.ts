import clerkClient from "@clerk/clerk-sdk-node";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  // This is the same as the `getAll` procedure in the `postRouter`
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });
    return users;
  }),
  getBySearch: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await clerkClient.users.getUserList({
        limit: 10,
        query: input.search,
      });
      return users;
    }),
});
