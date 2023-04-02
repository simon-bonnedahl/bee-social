import clerkClient, { User } from "@clerk/clerk-sdk-node";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
  fullName: `${user.firstName ?? "Not"} ${user.lastName ?? "Found"}`,
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

      return {
        ...filterUserForClient(user),
        followers,
        following,
        posts,
        fullName: `${user.firstName ?? "Not"} ${user.lastName ?? "Found"}`,
      };
    }),
  isFollowing: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followingId = input.userId;
      const followerId = ctx.userId;
      if (!followerId) return null;

      const follow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

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
