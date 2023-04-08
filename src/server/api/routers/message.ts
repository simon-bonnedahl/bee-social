import clerkClient from "@clerk/clerk-sdk-node";
import { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});

export const messageRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ text: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          senderId: ctx.userId,
          receiverId: input.userId,
        },
      });
      return message;
    }),
  getAllChats: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    //fetch all messages where user reciever id is equal to user id
    const messages = await ctx.prisma.message.findMany({
      where: {
        receiverId: userId,
      },
    });
    // return a list of all users who have sent messages to the user
    const userIds = messages.map((message) => message.senderId);
    const users = (
      await clerkClient.users.getUserList({
        userId: userIds,
        limit: 110,
      })
    ).map(filterUserForClient);

    const chats = [];

    for (const userId of userIds) {
      for (const user of users) {
        if (user.id === userId) {
          chats.push(user);
        }
      }
    }
    return chats;
  }),
  getAllFrom: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const messages = await ctx.prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId: input.userId,
            },
            {
              senderId: input.userId,
              receiverId: userId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    }),
});
