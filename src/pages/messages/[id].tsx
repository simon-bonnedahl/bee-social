import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Post from "~/components/Post";
import { SideMenu } from "~/components/SideMenu";
import { SignIn, useUser } from "@clerk/nextjs";
import { IoCreateOutline } from "react-icons/io5";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { user } = useUser();
  if (id !== "inbox") {
    //Fetch the specific chat of the id
  }

  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      {!user && <SignIn />}

      {user && (
        <main className="flex h-screen items-center justify-center overflow-hidden bg-gray-100">
          <SideMenu
            profileImageUrl={user.profileImageUrl ?? null}
            username={user.username ?? ""}
            highlight="messages"
          />

          <Inbox />
        </main>
      )}
    </>
  );
};

const Inbox = () => {
  return (
    <div className="my-20 flex h-5/6 rounded-sm  border border-slate-300 bg-white xl:ml-64 xl:w-8/12">
      <div className="flex h-full w-5/12 flex-col border-r border-slate-300">
        <div className="flex items-center justify-between border-b border-slate-300 p-6">
          <span className="text-lg font-semibold dark:text-white">
            Messages
          </span>
          <button className="duration-200 ease-in-out hover:scale-105">
            <IoCreateOutline className="h-8 w-8" />
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default SinglePostPage;
