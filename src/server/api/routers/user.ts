import clerkClient, { User } from "@clerk/clerk-sdk-node";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});

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
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (user) return filterUserForClient(user);
      return null;
    }),
});
