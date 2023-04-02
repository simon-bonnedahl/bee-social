import { Sidebar } from "@alfiejones/flowbite-react";
import { Spinner } from "flowbite-react";
import React from "react";
import { AiOutlineBell } from "react-icons/ai";
import { api } from "~/utils/api";

type NotificationsProps = {
  width?: string;
};
function Notifications(props: NotificationsProps) {
  const { data, isLoading } = api.user.getNotifications.useQuery();
  return (
    <React.Fragment>
      <Sidebar.Item
        href="#"
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
    </React.Fragment>
  );
}

export default Notifications;
