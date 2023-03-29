import {
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import clerkClient, { User } from "@clerk/clerk-sdk-node";
import { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import axios from "axios";
import { randomUUID } from "crypto";
import { decode } from "punycode";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const { BlobServiceClient } = require("@azure/storage-blob");

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});

const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author has no GitHub Account: ${author.id}`,
      });
    }
    return {
      post: {
        ...post,
        imageUrl:
          "https://beesocialstorage.blob.core.windows.net/images/" +
          post.imageId +
          ".png" +
          "?" +
          sasToken,
      },
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
    const res = await addUserDataToPosts(posts);
    return res;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return (await addUserDataToPosts([post]))[0];
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
    ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      if (input.image) {
        const imageId = await uploadImage(input.image);

        const post = await ctx.prisma.post.create({
          data: {
            authorId,
            content: input.content,
            imageId: imageId,
          },
        });

        return post;
      }
    }),
});

const uploadImage = async (file: string) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = blobServiceClient.getContainerClient("images");

  //take file to from base64 to buffer
  const buffer = Buffer.from(
    file.replace(/^data:image\/[a-z]+;base64,/, ""),
    "base64"
  );

  const id = randomUUID();
  const blobName = `${id}.png`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const response = await blockBlobClient.uploadData(buffer);
  console.log("image uploaded");

  return id;
};

const sasToken = generateSasToken(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_KEY,
  "images"
);

function generateSasToken(
  accountName: any,
  accountKey: any,
  containerName: any
) {
  // Create the SAS token
  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 100);
  startDate.setMinutes(startDate.getMinutes() - 100);

  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  const permissions = ContainerSASPermissions.parse("r");
  const sas = generateBlobSASQueryParameters(
    {
      containerName: containerName,
      permissions: permissions,
      startsOn: startDate,
      expiresOn: expiryDate,
    },
    sharedKeyCredential
  ).toString();

  return sas;
}