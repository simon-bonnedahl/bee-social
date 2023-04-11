/* eslint @typescript-eslint/restrict-template-expressions: "off" */
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import Menu from "~/components/Menu";
import { SignIn, useUser } from "@clerk/nextjs";
import { IoCreateOutline } from "react-icons/io5";
import { Spinner } from "flowbite-react";
import { AiOutlinePhone, AiOutlineVideoCamera } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import CreateChat from "~/components/CreateChat";
import { Message } from "@prisma/client";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Messages - {id}</title>
      </Head>
      <main className="flex h-screen items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!user && <SignIn />}

        {user && (
          <>
            <Menu
              profileImageUrl={user.profileImageUrl ?? null}
              username={user.username ?? ""}
              highlight="chat"
            />

            <Inbox chatId={id === "inbox" ? null : parseInt(id)} />
          </>
        )}
      </main>
    </>
  );
};

type InboxProps = {
  chatId: number | null;
};
const Inbox = (props: InboxProps) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(props.chatId);

  return (
    <div className="my-20 flex h-5/6 rounded-sm  border border-slate-300 bg-white dark:bg-gray-800  md:ml-24 md:w-10/12 lg:ml-64 lg:w-8/12">
      <div className="flex h-full w-4/12 flex-col border-r border-slate-300">
        <ChatList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>
      {selectedChat && <Chat chatId={selectedChat} />}
    </div>
  );
};
type ChatProps = {
  chatId: number;
};

const Chat = (props: ChatProps) => {
  const ctx = api.useContext();
  const { user: me } = useUser();

  const { data: chat, isLoading: isLoadingChat } =
    api.chat.getFullChat.useQuery({
      chatId: props.chatId,
    });

  const [input, setInput] = useState<string>("");

  const { mutate: sendMessage, isLoading: isSending } =
    api.chat.sendMessage.useMutation({
      onSuccess: () => {
        setInput("");
        toast.success("Message sent");
        void ctx.chat.getFullChat.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSendMessage = () => {
    if (!input) return;
    sendMessage({
      text: input,
      chatId: props.chatId,
    });
  };
  if (isLoadingChat || !chat || !chat.participants)
    return (
      <div className="flex h-full w-8/12 items-center justify-center">
        <Spinner color="warning" size="xl" />
      </div>
    );

  if (!chat.isGroupChat && chat.participants[0])
    return (
      <div className="flex w-8/12 flex-col">
        {/*Header */}
        <div className="flex w-full items-center justify-between border-b border-slate-300 px-10 py-6 ">
          <div className="flex gap-4">
            <div className="relative h-full w-16">
              <Image
                src={chat.participants[0].profileImageUrl ?? ""}
                alt="Profile picture"
                className="rounded-full"
                width={32}
                height={32}
              />
            </div>
            <span className="text-lg font-semibold dark:text-white">
              {chat.participants[0].firstName} {chat.participants[0].lastName}
            </span>
          </div>
          <div className="flex gap-4">
            <button className="duration-200 ease-in-out hover:scale-105">
              <AiOutlinePhone className="h-8 w-8 dark:text-white" />
            </button>
            <button className="duration-200 ease-in-out hover:scale-105">
              <AiOutlineVideoCamera className="h-8 w-8 dark:text-white" />
            </button>
          </div>
        </div>
        {/*Chat */}
        <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4">
          {chat?.messages?.map((message: Message) => {
            if (message.senderId === me?.id) {
              return (
                <div className="flex w-full justify-end" key={message.id}>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex max-w-xs items-center gap-2">
                      <span className="rounded-2xl bg-gray-200 p-3 text-sm">
                        {message.content}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div className="flex w-full justify-start gap-2" key={message.id}>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={chat.participants[0]?.profileImageUrl ?? ""}
                      alt="Profile picture"
                      className="rounded-full"
                      width={25}
                      height={25}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {chat.participants[0]?.firstName}{" "}
                      {chat.participants[0]?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex max-w-xs items-center gap-2">
                    <span className="rounded-2xl border border-gray-100 bg-transparent p-3 text-sm">
                      {message.content}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/*Input */}
        <div className="w-full p-4">
          <input
            type="text"
            className="flex w-full justify-between rounded-full border border-slate-300 p-3 "
            placeholder="Message ..."
            disabled={isSending}
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
  //Groupchat
  return (
    <div className="flex w-8/12 flex-col">
      {/*Header */}
      <div className="flex w-full items-center justify-between border-b border-slate-300 px-10 py-6 ">
        <div className="flex gap-4">
          <div className="relative h-full w-16">
            <Image
              src={chat.participants[0]?.profileImageUrl ?? ""}
              alt="Profile picture"
              className="absolute top-0 left-0 rounded-full"
              width={30}
              height={30}
            />
            <Image
              src={chat.participants[1]?.profileImageUrl ?? ""}
              alt="Profile picture"
              className="absolute top-2 left-2 rounded-full"
              width={30}
              height={30}
            />
          </div>
          <span className="text-lg font-semibold dark:text-white">
            {chat.name}
          </span>
        </div>
        <div className="flex gap-4">
          <button className="duration-200 ease-in-out hover:scale-105">
            <AiOutlinePhone className="h-8 w-8 dark:text-white" />
          </button>
          <button className="duration-200 ease-in-out hover:scale-105">
            <AiOutlineVideoCamera className="h-8 w-8 dark:text-white" />
          </button>
        </div>
      </div>
      {/*Chat */}
      <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4">
        {chat?.messages?.map((message: Message) => {
          if (message.senderId === me?.id) {
            return (
              <div className="flex w-full justify-end" key={message.id}>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex max-w-xs items-center gap-2">
                    <span className="rounded-2xl bg-gray-200 p-3 text-sm">
                      {message.content}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          const sender = chat.participants.find(
            (p) => p.id === message.senderId
          );
          return (
            <div className="flex w-full justify-start gap-2" key={message.id}>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={sender?.profileImageUrl ?? ""}
                    alt="Profile picture"
                    className="rounded-full"
                    width={25}
                    height={25}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {sender?.firstName} {sender?.lastName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex max-w-xs items-center gap-2">
                  <span className="rounded-2xl border border-gray-100 bg-transparent p-3 text-sm">
                    {message.content}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/*Input */}
      <div className="w-full p-4">
        <input
          type="text"
          className="flex w-full justify-between rounded-full border border-slate-300 p-3 "
          placeholder="Message ..."
          disabled={isSending}
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
  setSelectedChat: (id: number | null) => void;
  selectedChat: number | null;
};

const ChatList = (props: ChatListProps) => {
  const { data, isLoading } = api.chat.getChatList.useQuery();
  const router = useRouter();

  const { user } = useUser();

  if (isLoading) return <Spinner color="warning" />;
  if (!data) return <div>404</div>;

  const onSelect = (id: number) => {
    props.setSelectedChat(id);
    router.push(`/chat/${id}`).catch((e) => console.log(e));
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full items-center justify-between border-b border-slate-300 p-6">
        <span className="text-lg font-semibold dark:text-white">Messages</span>
        <CreateChat setSelectedChat={props.setSelectedChat} chats={data} />
      </div>
      {[...data].map((chat) => {
        //filter out the current user from the participants
        chat.participants = chat.participants.filter(
          (p) => p.username !== user?.username
        );

        if (chat.participants.length > 1)
          //Groupchat
          return (
            <button
              className={`flex w-full gap-2 p-3 px-5 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300 ${
                props.selectedChat === chat.id
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-white dark:bg-gray-800"
              }`}
              onClick={() => onSelect(chat.id)}
              key={chat.id}
              disabled={chat.id === props.selectedChat}
            >
              {/*Stack profile pictures */}
              <div className="relative h-full w-20">
                <Image
                  src={chat.participants[0]?.profileImageUrl ?? ""}
                  alt="Profile picture"
                  className="absolute top-0 left-0 rounded-full"
                  width={40}
                  height={40}
                />
                <Image
                  src={chat.participants[1]?.profileImageUrl ?? ""}
                  alt="Profile picture"
                  className="absolute top-2 left-2 rounded-full"
                  width={40}
                  height={40}
                />
              </div>

              <div className="flex flex-col items-start">
                <span className="font-semibold dark:text-white">
                  {chat.name ?? "Groupchat"}
                </span>
                <span className=" text-sm dark:text-white">
                  {chat.participants.map((p) => p.username).join(", ")}
                </span>
              </div>
            </button>
          );

        const otherParticipant = chat.participants[0];
        if (!otherParticipant) return null;

        return (
          //Single chat, get the other participants info
          <button
            className={`flex w-full gap-2 p-3 px-5 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300 ${
              props.selectedChat === chat.id
                ? "bg-gray-300 dark:bg-gray-600"
                : "bg-white dark:bg-gray-800"
            }`}
            onClick={() => onSelect(chat.id)}
            key={chat.id}
            disabled={chat.id === props.selectedChat}
          >
            <div className="h-full w-20">
              <Image
                src={otherParticipant.profileImageUrl}
                alt="Profile picture"
                className="rounded-full"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold dark:text-white">
                {`${otherParticipant.firstName} ${otherParticipant.lastName}`}
              </span>
              <span className=" text-sm dark:text-white">
                {otherParticipant.username}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.chat.getFullChat.prefetch({ chatId: parseInt(id) });

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
