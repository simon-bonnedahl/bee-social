import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api, RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { Button, Spinner } from "flowbite-react";
import Post, { PostSmall } from "~/components/Post";
import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import { SignIn, useUser } from "@clerk/nextjs";
import { SideMenu } from "~/components/SideMenu";
import Feed from "~/components/Feed";
import { User } from "@clerk/nextjs/dist/api";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "react-hot-toast";

type ProfileBioProps = RouterOutputs["user"]["getProfileData"];

const ProfileBio = (user: ProfileBioProps) => {
  const { mutate, isLoading: isFollowing } = api.user.follow.useMutation({
    onSuccess: () => {
      toast.success("Followed");
    },
    onError: (e: any) => {
      console.log(e);
      toast.error("Something went wrong");
    },
  });
  if (!user) return <Spinner color="warning" />;

  const onFollow = () => {
    mutate({ userId: user.id });
  };
  return (
    //Bio like instagram
    <div className="w-fill flex items-center ">
      <div className=" py-12 px-24">
        <Image
          src={user.profileImageUrl}
          alt="Profile Picture"
          className="h-40 w-40 rounded-full"
          width={200}
          height={200}
        />
      </div>

      <div className="flex h-full flex-col justify-around ">
        {/*Top*/}
        <div className="flex items-center gap-6 py-2">
          <span className="text-lg font-semibold dark:text-white">
            @{user.username}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={onFollow}
              className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
            >
              {isFollowing ? <Spinner color="warning" /> : <span>Follow</span>}
            </Button>
            <Button className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500">
              Message
            </Button>
            <button className="px-1">
              <BsThreeDots className="h-8 w-8" />
            </button>
          </div>
        </div>

        {/*Stats*/}
        <div className="flex gap-6  py-2 text-lg">
          <div>
            <span className="font-semibold">{user.posts} </span>posts
          </div>
          <div>
            <span className="font-semibold">{user.followers} </span>followers
          </div>
          <div>
            <span className="font-semibold">{user.following} </span>following
          </div>
        </div>

        {/*Bio*/}
        <div className=" h-24 max-w-2xl">
          <span className="text-sm font-semibold">{user.fullName}</span>
          <p className=" flex-wrap break-words">
            (bio) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vitae nisl vitae nisl lacinia ultricies. Sed vitae nisl vitae nisl
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <Spinner color="warning" />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="grid w-fit grid-cols-3 px-8">
      {data.map(({ post, author }) => (
        <PostSmall post={post} author={author} key={post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.user.getProfileData.useQuery({
    username,
  });

  const { user } = useUser();
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <main className="flex min-h-screen items-center justify-center">
        {!user && <SignIn />}

        {user && (
          <>
            <SideMenu profileImageUrl={user?.profileImageUrl ?? null} />
          </>
        )}
        <div className="ml-64 flex flex-col gap-8">
          <ProfileBio {...data} />
          <div className="h-0.5 w-full border-b border-gray-300"></div>
          <ProfileFeed userId={data.id} />
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.user.getByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
