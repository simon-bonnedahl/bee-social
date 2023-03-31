import { Sidebar, Spinner } from "@alfiejones/flowbite-react";
import { SignOutButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { IoPaperPlaneOutline, IoSettingsOutline } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import CreatePost from "./CreatePost";

import Logo from "./Logo";
import Searcher from "./Searcher";
import ThemeSwitch from "./ThemeSwitch";

type SideMenuProps = {
  profileImageUrl: string;
  username: string;
};
function SideMenu(props: SideMenuProps) {
  const BREAKPOINT_TABLET = 1048;
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

  return width < BREAKPOINT_TABLET ? (
    <SmallSideMenu {...props} />
  ) : (
    <LargeSideMenu {...props} />
  );
}

function LargeSideMenu(props: SideMenuProps) {
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
                <AiOutlineHome className="h-8 w-8" />
                Home
              </div>
            </Sidebar.Item>
            <Searcher width="full" />
            <Sidebar.Item
              href="#"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoPaperPlaneOutline className="h-8 w-8" />
                Messages
              </div>
            </Sidebar.Item>
            <CreatePost width="full" />
            <Sidebar.Item
              href={"/" + props.username}
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
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
              href="#"
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

function SmallSideMenu(props: SideMenuProps) {
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
              <div className="mt-2 flex items-center gap-5  ">
                <AiOutlineHome className="h-8 w-8" />
              </div>
            </Sidebar.Item>
            <Searcher />
            <Sidebar.Item
              href="#"
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoPaperPlaneOutline className="h-8 w-8" />
              </div>
            </Sidebar.Item>
            <CreatePost />
            <Sidebar.Item
              href={"/" + props.username}
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
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
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="#"
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoSettingsOutline className="h-8 w-8 " />
              </div>
            </Sidebar.Item>
            <ThemeSwitch />
            <Sidebar.Item className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold">
              <SignOutButton>
                <div className="mt-2 flex items-center gap-5  ">
                  <VscSignOut className="h-8 w-8 " />
                </div>
              </SignOutButton>
            </Sidebar.Item>
            <Searcher />
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export { SideMenu };
