import { Sidebar } from "@alfiejones/flowbite-react";
import dayjs from "dayjs";
import { Spinner } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { api, RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

type NotificationsProps = {
  width?: string;
};
function Notifications(props: NotificationsProps) {
  const { data, isLoading } = api.user.getNotifications.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Sidebar.Item
        onClick={() => setIsOpen(true)}
        className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
      >
        <div className="mt-2 flex items-center gap-5  ">
          <div className="relative">
            <AiOutlineBell className="h-8 w-8" />
            <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-400 text-xs font-bold text-white dark:border-gray-900">
              {isLoading ? <Spinner color="warning" /> : data?.length}
            </div>
          </div>

          {props.width && props.width === "full" && "Notifications"}
        </div>
      </Sidebar.Item>

      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} notifications={data} />
    </React.Fragment>
  );
}
type DrawerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notifications?: RouterOutputs["user"]["getNotifications"];
};

const Drawer = (props: DrawerProps) => {
  return (
    <main
      className={
        " fixed inset-0 top-0 left-0 z-50 transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out " +
        (props.isOpen
          ? " translate-x-0 opacity-100 transition-opacity duration-500  "
          : " -translate-x-full opacity-0 transition-all delay-500  ")
      }
    >
      <section
        className={
          " delay-400 absolute left-0 h-full w-96 max-w-lg transform bg-white shadow-xl transition-all duration-500 ease-in-out  " +
          (props.isOpen ? " translate-x-0 " : " -translate-x-full ")
        }
      >
        <article className="relative flex h-full w-96 max-w-lg flex-col space-y-6 overflow-y-scroll pb-10">
          <header className="p-4 text-lg font-bold">Notifications</header>
          <div className="flex h-full w-full flex-col space-y-2 p-4">
            {props.notifications?.map(({ notification, user }) => (
              <div
                key={notification.id}
                className="flex w-full flex-col space-y-2"
              >
                {notification.type === "FOLLOW" && (
                  <FollowNotification notification={notification} user={user} />
                )}
                {notification.type === "LIKE" && (
                  <LikeNotification notification={notification} user={user} />
                )}
                {notification.type === "COMMENT" && (
                  <CommentNotification
                    notification={notification}
                    user={user}
                  />
                )}
              </div>
            ))}
          </div>
        </article>
      </section>
      <section
        className=" h-full w-screen cursor-pointer "
        onClick={() => {
          props.setIsOpen(false);
        }}
      ></section>
    </main>
  );
};

const FollowNotification = ({
  notification,
  user,
}: RouterOutputs["user"]["getNotifications"][number]) => {
  return (
    <Link
      className="flex w-full items-center justify-between hover:cursor-pointer"
      href={`/${user.username ?? ""}`}
    >
      <div className="flex items-center space-x-2">
        <Image
          src={user.profileImageUrl}
          width={40}
          height={40}
          className="rounded-full"
          alt="Profile picture"
        />
        <span className="text-sm">
          <span className="font-semibold">{user.username} </span>
          started following you
        </span>

        {/*Time ago */}

        <span className="text-xs text-gray-500">
          {dayjs(notification.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

const LikeNotification = ({
  notification,
  user,
}: RouterOutputs["user"]["getNotifications"][number]) => {
  return (
    <Link
      className="flex w-full items-center justify-between hover:cursor-pointer"
      href={`/post/${notification.postId ?? ""}`}
    >
      <div className="flex items-center space-x-2">
        <Image
          src={user.profileImageUrl}
          width={40}
          height={40}
          className="rounded-full"
          alt="Profile picture"
        />
        <span className="text-sm">
          <span className="font-semibold">{user.username} </span>
          liked your post
        </span>

        {/*Time ago */}

        <span className="text-xs text-gray-500">
          {dayjs(notification.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

const CommentNotification = ({
  notification,
  user,
}: RouterOutputs["user"]["getNotifications"][number]) => {
  return (
    <Link
      className="flex w-full items-center justify-between hover:cursor-pointer"
      href={`/post/${notification.postId ?? ""}`}
    >
      <div className="flex items-center space-x-2">
        <Image
          src={user.profileImageUrl}
          width={40}
          height={40}
          className="rounded-full"
          alt="Profile picture"
        />
        <span className="text-sm">
          <span className="font-semibold">{user.username} </span>
          commented on your post
        </span>

        {/*Time ago */}

        <span className="text-xs text-gray-500">
          {dayjs(notification.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

export default Notifications;
