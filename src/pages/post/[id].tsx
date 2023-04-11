import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Post from "~/components/Post";
import Menu from "~/components/Menu";
import { SignIn, useUser } from "@clerk/nextjs";
import { Spinner } from "flowbite-react";

const SinglePostPage: NextPage<{ id: number }> = ({ id }) => {
  const { data: post, isLoading } = api.post.getById.useQuery({
    id,
  });
  const { user } = useUser();
  if (isLoading) return <Spinner color="warning" />;
  if (!post) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${post.content} - ${post.author?.username}`}</title>
      </Head>
      {!user && <SignIn />}
      <main className="flex min-h-screen items-center justify-center">
        {user && (
          <>
            <Menu
              profileImageUrl={user.profileImageUrl ?? null}
              username={user.username ?? ""}
            />
          </>
        )}

        <Post {...post} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  //parse the id to an int

  await ssg.post.getById.prefetch({ id: parseInt(id) });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
