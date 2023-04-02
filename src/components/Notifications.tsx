import { Sidebar } from "@alfiejones/flowbite-react";
import { Spinner } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineBell } from "react-icons/ai";
import { api } from "~/utils/api";

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
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </React.Fragment>
  );
}
type DrawerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Drawer = (props: DrawerProps) => {
  return (
    <main
      className={
        " fixed inset-0 top-0 left-0 z-10 transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out " +
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

export default Notifications;
