import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({ name: z.string().optional(), userIds: z.array(z.string()) })
    )
    .mutation(async ({ ctx, input }) => {
      input.userIds.push(ctx.userId);
      const chat = await ctx.prisma.chat.create({
        data: {
          name: input.name || null,
          isGroupChat: input.userIds.length > 2,
          participants: {
            connect: input.userIds.map((userId) => ({ id: userId })),
          },
        },
      });
      return chat;
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
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            readBy: true,
          },
          take: 1,
        },
      },
    });

    //fetch the last message for each chat check if its read by the user and then sort the chats by the last message date
    const sortedChats = chats

      .map((chat) => {
        const lastMessage = chat.messages[0];
        const isRead = lastMessage?.readBy.some((user) => user.id === userId);
        return {
          ...chat,
          lastMessage,
          isRead,
        };
      })
      .sort((a, b) => {
        if (a.lastMessage && b.lastMessage) {
          return (
            b.lastMessage.createdAt.getTime() -
            a.lastMessage.createdAt.getTime()
          );
        }
        return 0;
      });
    return sortedChats;
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
          readBy: {
            connect: {
              id: ctx.userId,
            },
          },
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

      const messages = await ctx.prisma.message.findMany({
        where: {
          chatId: input.chatId,
        },
        include: {
          readBy: true,
        },
      });

      messages.forEach(async (message) => {
        if (!message.readBy.some((user) => user.id === ctx.userId)) {
          await ctx.prisma.message.update({
            where: {
              id: message.id,
            },
            data: {
              readBy: {
                connect: {
                  id: ctx.userId,
                },
              },
            },
          });
        }
      });

      return chat;
    }),
  getNumberOfUnreadChats: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const chats = await ctx.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          include: {
            readBy: true,
          },
        },
      },
    });
    const numberOfUnreadChats = chats.reduce((acc, chat) => {
      const unreadMessages = chat.messages.filter(
        (message) => !message.readBy.some((user) => user.id === userId)
      );
      return acc + unreadMessages.length;
    }, 0);
    return numberOfUnreadChats;
  }),
});
