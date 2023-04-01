import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Post from "~/components/Post";
import { SideMenu } from "~/components/SideMenu";
import { SignIn, useUser } from "@clerk/nextjs";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.post.getById.useQuery({
    id: parseInt(id),
  });
  if (!data) return <div>404</div>;
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      {!user && <SignIn />}
      <main className="flex min-h-screen items-center justify-center">
        {user && (
          <>
            <SideMenu
              profileImageUrl={user.profileImageUrl ?? null}
              username={user.username ?? ""}
              highlight="profile"
            />
          </>
        )}

        <Post post={data.post} author={data.author} />
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
