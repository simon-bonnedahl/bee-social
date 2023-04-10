import clerkClient, { User } from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
  fullName: `${user.firstName ?? "Not"} ${user.lastName ?? "Found"}`,
});

export const userRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        username: z.string(),
        profileImageUrl: z.string(),
        email: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.userId,
        },
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }
      const newUser = await ctx.prisma.user.create({
        data: {
          id: ctx.userId,
          username: input.username,
          profileImageUrl: input.profileImageUrl,
          email: input.email,
          firstName: input.firstName || null,
          lastName: input.lastName || null,
        },
      });
      return newUser;
    }),

  me: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });
    return user;
  }),

  getBySearch: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: input.search,
              },
            },
            {
              firstName: {
                contains: input.search,
              },
            },
            {
              lastName: {
                contains: input.search,
              },
            },
          ],
        },
      });

      return users;
    }),
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      return user;
    }),
  getById: publicProcedure

    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return user;
    }),

  follow: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const followingId = input.userId;
      const followerId = ctx.userId;
      if (!followerId) return null;

      const follow = await ctx.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      const notification = await ctx.prisma.notification.findFirst({
        where: {
          userId: followingId,
          type: "FOLLOW",
          userId2: followerId,
        },
      });
      if (!notification)
        await ctx.prisma.notification.create({
          data: {
            userId: followingId,
            type: "FOLLOW",
            userId2: followerId,
          },
        });

      return follow;
    }),
  unfollow: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const followingId = input.userId;
      const followerId = ctx.userId;
      if (!followerId) return null;

      const follow = await ctx.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return follow;
    }),
  getFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followers = await ctx.prisma.follow.findMany({
        where: {
          followingId: input.userId,
        },
      });
      //attach user data
      const userIds = followers.map((follower) => follower.followerId);
      const users = (
        await clerkClient.users.getUserList({
          userId: userIds,
          limit: 110,
        })
      ).map(filterUserForClient);
      return followers.map((follower) => {
        const user = users.find((user) => user.id === follower.followerId);
        return {
          follower: {
            ...follower,
          },
          user: {
            ...user,
          },
        };
      });
    }),

  getProfileData: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user) return null;
      //get number of followers and following
      const followers = await ctx.prisma.follow.count({
        where: {
          followingId: user.id,
        },
      });
      const following = await ctx.prisma.follow.count({
        where: {
          followerId: user.id,
        },
      });
      const posts = await ctx.prisma.post.count({
        where: {
          authorId: user.id,
        },
      });

      const u = await ctx.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      const bio = u?.bio;

      return {
        ...filterUserForClient(user),
        followers,
        following,
        posts,
        fullName: `${user.firstName ?? "Not"} ${user.lastName ?? "Found"}`,
        bio,
      };
    }),
  isFollowing: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followingId = input.userId;
      const followerId = ctx.userId;
      if (!followerId) return null;

      const follow = true;

      if (follow) return true;
      return false;
    }),
  getNotifications: privateProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    //attach user data
    const users = (await clerkClient.users.getUserList()).map(
      filterUserForClient
    );
    return notifications.map((notification) => {
      const user = users.find((user) => user.id === notification.userId2);
      if (!user) {
        console.error("User NOT FOUND", user);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `User for notification not found. NOTIFICATION ID: ${
            notification.id
          }, USER ID: ${notification.userId2 ?? "(No id)"}`,
        });
      }

      return {
        notification: {
          ...notification,
        },
        user: {
          ...user,
        },
      };
    });
  }),
});
