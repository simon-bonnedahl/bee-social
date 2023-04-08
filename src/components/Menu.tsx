import { Sidebar, Spinner } from "@alfiejones/flowbite-react";
import { SignOutButton } from "@clerk/nextjs";
import { Tooltip } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineBell, AiFillHome } from "react-icons/ai";
import {
  IoPaperPlaneOutline,
  IoSettingsOutline,
  IoPaperPlane,
} from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import CreatePost from "./CreatePost";

import Logo from "./Logo";
import Notifications from "./Notifications";
import Searcher from "./Searcher";
import ThemeSwitch from "./ThemeSwitch";

type MenuProps = {
  profileImageUrl: string;
  username: string;
  highlight?: string;
};
function Menu(props: MenuProps) {
  const BREAKPOINT_TABLET = 1048;
  const BREAKPOINT_MOBILE = 640;
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    // get the width of the window
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    // add the event listener
    window.addEventListener("resize", handleResize);
    // call the handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!width) return null;

  if (width < BREAKPOINT_MOBILE) return <BottomMenu {...props} />;
  if (width < BREAKPOINT_TABLET) return <CollapsedSideMenu {...props} />;

  return <SideMenu {...props} />;
}

function SideMenu(props: MenuProps) {
  return (
    <div className="fixed top-0 left-0 h-full">
      <Sidebar
        aria-label="Large sidebar"
        className=" w-64 border-x border-slate-300 "
      >
        <div className="p-4">
          <Logo size="full" />
        </div>
        <Sidebar.Items className="mt-8">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                {props.highlight === "home" ? (
                  <AiFillHome className="h-8 w-8" />
                ) : (
                  <AiOutlineHome className="h-8 w-8" />
                )}
                Home
              </div>
            </Sidebar.Item>
            <Searcher width="full" />
            <Sidebar.Item
              href="/messages/inbox"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                {props.highlight === "messages" ? (
                  <IoPaperPlane className="h-8 w-8" />
                ) : (
                  <IoPaperPlaneOutline className="h-8 w-8" />
                )}
                Messages
              </div>
            </Sidebar.Item>
            <Notifications width="full" />

            <CreatePost width="full" />
            <Sidebar.Item
              href={"/" + props.username}
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="relative mt-2 flex items-center  gap-5">
                {props.highlight === "profile" && (
                  <div className="z-5 absolute inset-0 flex h-8 w-8 scale-125 items-center justify-center rounded-full border-2 border-black bg-transparent dark:border-white"></div>
                )}
                {props.profileImageUrl ? (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={props.profileImageUrl}
                    alt="Profile Picture"
                    width={35}
                    height={35}
                  />
                ) : (
                  <Spinner color="warning" />
                )}
                Profile
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/settings"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoSettingsOutline className="h-8 w-8 " />
                Settings
              </div>
            </Sidebar.Item>
            <ThemeSwitch width="full" />
            <Sidebar.Item className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold">
              <SignOutButton>
                <div className="mt-2 flex items-center gap-5  ">
                  <VscSignOut className="h-8 w-8 " />
                  Sign Out
                </div>
              </SignOutButton>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

function CollapsedSideMenu(props: MenuProps) {
  return (
    <div className="fixed top-0 left-0 h-full">
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className="w-fit border-x border-slate-300"
      >
        <div className="p-4">
          <Logo />
        </div>
        <Sidebar.Items className="mt-8">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/"
              className=" w-fit text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <Tooltip content="Home">
                <div className="mt-2 flex items-center gap-5  ">
                  {props.highlight === "home" ? (
                    <AiFillHome className="h-8 w-8" />
                  ) : (
                    <AiOutlineHome className="h-8 w-8" />
                  )}
                </div>
              </Tooltip>
            </Sidebar.Item>
            <Tooltip content="Search">
              <Searcher />
            </Tooltip>
            <Sidebar.Item
              href="/messages/inbox"
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <Tooltip content="Messages">
                <div className="mt-2 flex items-center gap-5  ">
                  {props.highlight === "messages" ? (
                    <IoPaperPlane className="h-8 w-8" />
                  ) : (
                    <IoPaperPlaneOutline className="h-8 w-8" />
                  )}
                </div>
              </Tooltip>
            </Sidebar.Item>
            <Tooltip content="Notifications">
              <Notifications />
            </Tooltip>
            <Tooltip content="Create Post">
              <CreatePost />
            </Tooltip>
            <Sidebar.Item
              href={"/" + props.username}
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <Tooltip content="Profile">
                <div className="relative mt-2 flex items-center  gap-5">
                  {props.highlight === "profile" && (
                    <div className="z-5 absolute inset-0 flex h-8 w-8 scale-125 items-center justify-center rounded-full border-2 border-black bg-transparent dark:border-white"></div>
                  )}
                  {props.profileImageUrl ? (
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={props.profileImageUrl}
                      alt="Profile Picture"
                      width={35}
                      height={35}
                    />
                  ) : (
                    <Spinner color="warning" />
                  )}
                </div>
              </Tooltip>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Tooltip content="Settings">
              <Sidebar.Item
                href="/settings"
                className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
              >
                <div className="mt-2 flex items-center gap-5  ">
                  <IoSettingsOutline className="h-8 w-8 " />
                </div>
              </Sidebar.Item>
            </Tooltip>
            <Tooltip content="Switch theme">
              <ThemeSwitch />
            </Tooltip>
            <Sidebar.Item className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold">
              <Tooltip content="Sign out">
                <SignOutButton>
                  <div className="mt-2 flex items-center gap-5  ">
                    <VscSignOut className="h-8 w-8 " />
                  </div>
                </SignOutButton>
              </Tooltip>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

function BottomMenu(props: MenuProps) {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
        <button
          type="button"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
            Home
          </span>
        </button>
        <button
          type="button"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            ></path>
          </svg>
          <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
            Wallet
          </span>
        </button>

        <button
          type="button"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
          </svg>
          <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
            Settings
          </span>
        </button>
        <button
          type="button"
          className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            ></path>
          </svg>
          <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}

export default Menu;
