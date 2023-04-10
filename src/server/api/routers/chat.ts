import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({ name: z.string().optional(), userIds: z.array(z.string()) })
    )
    .mutation(async ({ ctx, input }) => {
      input.userIds.push(ctx.userId);
      const message = await ctx.prisma.chat.create({
        data: {
          name: input.name || null,
          isGroupChat: input.userIds.length > 2,
          participants: {
            connect: input.userIds.map((userId) => ({ id: userId })),
          },
        },
      });
      return message;
    }),

  getChatList: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    //fetch chats where the user is a participant and include all the other participants
    const chats = await ctx.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          where: {
            id: {
              not: userId,
            },
          },
        },
      },
    });
    return chats;
  }),
  sendMessage: privateProcedure
    .input(
      z.object({
        chatId: z.number(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.text,
          senderId: ctx.userId,
          chatId: input.chatId,
        },
      });
      return message;
    }),
  getMessages: privateProcedure
    .input(
      z.object({
        chatId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: {
          chatId: input.chatId,
        },
      });
      return messages;
    }),
  getFullChat: privateProcedure
    .input(
      z.object({
        chatId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          messages: true,
          participants: {
            where: {
              id: {
                not: ctx.userId,
              },
            },
          },
        },
      });
      return chat;
    }),
});
