import { Modal, Radio, Spinner } from "flowbite-react";
import React, { useEffect } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { InputField } from "./Searcher";
import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { router } from "@trpc/server";
import { useRouter } from "next/router";

type CreateChatProps = {
  setSelectedChat: (id: number) => void;
  chats: RouterOutputs["chat"]["getChatList"];
};

function CreateChat(props: CreateChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [chatName, setChatName] = React.useState("");
  const { user: me } = useUser();

  const [users, setUsers] = React.useState<User[]>([]);

  const router = useRouter();

  const ctx = api.useContext();

  const {
    mutate,
    isLoading: isCreatingChat,
    data: newChat,
  } = api.chat.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      setUsers([]);
      setChatName("");
      void ctx.chat.getChatList.invalidate();

      toast.success("Chat created");
    },
    onError: (e) => {
      toast.error("Something went wrong");
    },
  });

  const { data, isLoading } = api.user.getBySearch.useQuery({
    search: input,
  });
  const onCreateChat = () => {
    if (chatName && users.length > 1)
      //Group chat
      mutate({
        userIds: users.map((user) => user.id),
        name: chatName,
      });
    if (users.length < 2) {
      // Single chat
      //Check for chat duplication

      const chat = Object.values(props.chats).find((chat) =>
        chat.participants.find(
          (participant: { id: string }) =>
            participant.id === users[0]?.id && chat.isGroupChat === false
        )
      );
      if (chat) {
        setIsOpen(false);
        setUsers([]);
        setChatName("");
        props.setSelectedChat(chat.id);
        router.push(`/chat/${chat.id}`).catch((e) => console.log(e));

        return;
      } else {
        mutate({
          userIds: users.map((user) => user.id),
        });
      }
    }
  };

  useEffect(() => {
    if (!isCreatingChat && newChat) {
      router.push(`/chat/${newChat.id}`).catch((e) => console.log(e));
      props.setSelectedChat(newChat.id);
    }
  }, [isCreatingChat, newChat]);
  return (
    <React.Fragment>
      <button
        className="duration-200 ease-in-out hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <IoCreateOutline className="h-8 w-8 dark:text-white" />
      </button>
      <Modal
        title="Create Chat"
        show={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
      >
        <Modal.Header>
          <InputField input={input} setInput={setInput} />
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-4">
            {users
              .filter((user, index) => index < 4)
              .map((filteredUsers) => (
                <span className="text-xs text-gray-500" key={filteredUsers.id}>
                  {filteredUsers.username}
                </span>
              ))}
            {users.length > 4 && (
              <span className="text-xs text-gray-500">
                and <span className="font-semibold"> {users.length - 4} </span>
                more
              </span>
            )}
          </div>
          <div className="flex h-96 flex-col overflow-y-scroll">
            {isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner color="warning" size="xl" />
              </div>
            )}
            {data?.length === 0 && <div>No users found</div>}

            {data
              ?.filter((user) => user.id !== me?.id)
              .map((user) => (
                <div
                  className="flex w-full items-center justify-between  px-4 py-2 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300"
                  key={user.id}
                  onClick={() => {
                    if (users.includes(user)) {
                      setUsers(users.filter((u) => u.id !== user.id));
                    } else {
                      setUsers([...users, user]);
                    }
                  }}
                >
                  <div className="flex gap-2">
                    <Image
                      src={user.profileImageUrl}
                      alt="Profile picture"
                      className="rounded-full"
                      width={50}
                      height={50}
                    />
                    <div className="flex items-center gap-2  dark:text-white">
                      {user.username}
                    </div>
                  </div>

                  <Radio checked={users.includes(user)} />
                </div>
              ))}
          </div>

          <form
            className="mt-4 flex items-center justify-between"
            onSubmit={(e) => {
              e.preventDefault();
              onCreateChat();
            }}
          >
            {users.length > 1 && (
              <input
                type="text"
                placeholder="Chat name"
                ref={(input) => input && input.focus()}
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="w-full rounded-md border-2 border-gray-300"
              />
            )}

            <button
              type="submit"
              className="rounded-md bg-blue-500 p-2 text-white"
            >
              Create
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default CreateChat;
