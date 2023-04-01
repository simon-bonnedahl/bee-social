import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Post from "~/components/Post";
import { SideMenu } from "~/components/SideMenu";
import { SignIn, useUser } from "@clerk/nextjs";
import { IoCreateOutline } from "react-icons/io5";
import { Spinner } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="my-20 flex h-5/6 rounded-sm  border border-slate-300 bg-white xl:ml-64 xl:w-8/12">
      <div className="flex h-full w-4/12 flex-col border-r border-slate-300">
        <div className="flex w-full items-center justify-between border-b border-slate-300 p-6">
          <span className="text-lg font-semibold dark:text-white">
            Messages
          </span>
          <button className="duration-200 ease-in-out hover:scale-105">
            <IoCreateOutline className="h-7 w-7" />
          </button>
        </div>
        <ChatList setSelected={setSelected} />
      </div>
      <Chat username={selected ?? ""} />
    </div>
  );
};
type ChatProps = {
  username: string;
};

const Chat = (props: ChatProps) => {
  const { data, isLoading } = api.user.getByUsername.useQuery({
    username: props.username,
  });

  const ctx = api.useContext();

  const { data: messages, isLoading: isLoadingMessages } =
    api.message.getAllFrom.useQuery({
      userId: data?.id ?? "",
    });

  const [input, setInput] = useState<string>("");

  const { mutate: sendMessage, isLoading: isSending } =
    api.message.create.useMutation({
      onSuccess: () => {
        setInput("");
        toast.success("Message sent");
        void ctx.message.getAllFrom.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSendMessage = () => {
    if (!input) return;
    if (!data?.id) return;
    sendMessage({
      text: input,
      userId: data?.id,
    });
  };
  if (isLoading)
    return (
      <div className="flex h-full w-8/12 items-center justify-center">
        <Spinner color="warning" size="xl" />
      </div>
    );
  if (!data) return <div>404</div>;
  return (
    <div className="flex w-8/12 flex-col">
      {/*Header */}
      <div className="flex w-full items-center border-b border-slate-300 p-6">
        <span className="text-lg font-semibold dark:text-white">
          {data?.fullName}
        </span>
      </div>
      {/*Chat */}
      <div className="flex h-full flex-col gap-4 overflow-y-scroll p-4">
        {messages?.map((message) => (
          <div
            className={`flex w-full items-center justify-${
              message.senderId === data?.id ? "start" : "end"
            }`}
            key={message.id}
          >
            <div
              className={`flex flex-col items-${
                message.senderId === data?.id ? "start" : "end"
              }`}
            >
              <div
                className={`flex items-center gap-2 rounded-md p-2 ${
                  message.senderId === data?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <span>{message.content}</span>
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*Input */}
      <div className="w-full p-4">
        <input
          type="text"
          className=" w-full rounded-full border border-slate-300 p-3"
          placeholder="Message ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
};
type ChatListProps = {
  setSelected: (id: string | null) => void;
};

const ChatList = (props: ChatListProps) => {
  const { data: chats, isLoading } = api.user.getAll.useQuery();

  if (isLoading) return <Spinner color="warning" />;
  if (!chats) return <div>404</div>;
  return (
    <div className="flex h-full flex-col gap-2">
      {chats.map((chat) => (
        <button
          className="flex w-full gap-2  px-2 py-2 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300"
          onClick={() => props.setSelected(chat.username)}
          key={chat.id}
        >
          <Image
            src={chat.profileImageUrl}
            alt="Profile picture"
            className="rounded-full"
            width={50}
            height={50}
          />
          <div className="flex items-center gap-2">{chat.username}</div>
        </button>
      ))}
    </div>
  );
};
export default SinglePostPage;
