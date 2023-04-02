import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Post from "~/components/Post";
import { SideMenu } from "~/components/SideMenu";
import { SignIn, useUser } from "@clerk/nextjs";
import { IoCreateOutline } from "react-icons/io5";
import { Spinner } from "flowbite-react";
import { AiOutlinePhone, AiOutlineVideoCamera } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const SinglePostPage: NextPage<{ username: string }> = ({ username }) => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Messages - {username}</title>
      </Head>
      <main className="flex h-screen items-center justify-center overflow-hidden bg-gray-100">
        {!user && <SignIn />}

        {user && (
          <>
            <SideMenu
              profileImageUrl={user.profileImageUrl ?? null}
              username={user.username ?? ""}
              highlight="messages"
            />

            <Inbox username={username} />
          </>
        )}
      </main>
    </>
  );
};

type InboxProps = {
  username: string;
};
const Inbox = (props: InboxProps) => {
  const [selected, setSelected] = useState<string | null>(props.username);
  useEffect(() => {}, [selected]);

  return (
    <div className="my-20 flex h-5/6 rounded-sm  border border-slate-300 bg-white xl:ml-64 xl:w-8/12">
      <div className="flex h-full w-4/12 flex-col border-r border-slate-300">
        <div className="flex w-full items-center justify-between border-b border-slate-300 p-6">
          <span className="text-lg font-semibold dark:text-white">
            Messages
          </span>
          <button className="duration-200 ease-in-out hover:scale-105">
            <IoCreateOutline className="h-8 w-8" />
          </button>
        </div>
        <ChatList selected={selected} setSelected={setSelected} />
      </div>
      {selected && <Chat username={selected} />}
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
  if (!data)
    return (
      <div className="flex h-full w-8/12 items-center justify-center">
        <span className="text-lg font-semibold dark:text-white">
          Could not find user
        </span>
      </div>
    );
  return (
    <div className="flex w-8/12 flex-col">
      {/*Header */}
      <div className="flex w-full items-center justify-between border-b border-slate-300 px-10 py-6 ">
        <div className="flex gap-4">
          <Image
            src={data.profileImageUrl}
            alt="Profile picture"
            className="rounded-full"
            width={32}
            height={32}
          />
          <span className="text-lg font-semibold dark:text-white">
            {data?.fullName}
          </span>
        </div>
        <div className="flex gap-4">
          <button className="duration-200 ease-in-out hover:scale-105">
            <AiOutlinePhone className="h-8 w-8" />
          </button>
          <button className="duration-200 ease-in-out hover:scale-105">
            <AiOutlineVideoCamera className="h-8 w-8" />
          </button>
        </div>
      </div>
      {/*Chat */}
      <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4">
        {messages?.map((message) => (
          <div
            className={`flex w-full items-end justify-${
              message.senderId === data?.id ? "start" : "end"
            }`}
            key={message.id}
          >
            <div
              className={`flex max-w-sm  items-center gap-2 rounded-lg p-3  ${
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
        ))}
      </div>
      {/*Input */}
      <div className="w-full p-4">
        <input
          type="text"
          className="flex w-full justify-between rounded-full border border-slate-300 p-3 "
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
  selected: string | null;
};

const ChatList = (props: ChatListProps) => {
  const { data: chats, isLoading } = api.user.getAll.useQuery();
  const router = useRouter();

  if (isLoading) return <Spinner color="warning" />;
  if (!chats) return <div>404</div>;

  const onSelect = (username: string) => {
    props.setSelected(username);
    router.push(`/messages/${username}`);
  };
  return (
    <div className="flex h-full flex-col">
      {chats.map((chat) => (
        <button
          className={`flex w-full gap-2  p-3 px-5 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300 ${
            props.selected === chat.username && "bg-gray-300"
          }`}
          onClick={() => onSelect(chat.username ?? "")}
          key={chat.id}
          disabled={chat.username === props.selected}
        >
          <Image
            src={chat.profileImageUrl}
            alt="Profile picture"
            className="rounded-full"
            width={60}
            height={60}
          />
          <div className="flex flex-col items-start">
            <span className="font-semibold">
              {chat.firstName + " " + chat.lastName}
            </span>
            <span>{chat.username}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const username = context.params?.username;

  if (typeof username !== "string") throw new Error("no username");

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

export default SinglePostPage;
