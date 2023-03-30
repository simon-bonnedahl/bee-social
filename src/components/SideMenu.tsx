import { Sidebar, Spinner } from "@alfiejones/flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiFillAlert,
  AiOutlineHome,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoPaperPlaneOutline, IoSettingsOutline } from "react-icons/io5";
import CreatePost from "./CreatePost";

import Logo from "./Logo";
import ThemeSwitch from "./ThemeSwitch";

type SideMenuProps = {
  profileImageUrl: string | null;
  width: number;
};
function SideMenu(props: SideMenuProps) {
  const BREAKPOINT_TABLET = 1048;
  if (props.width < BREAKPOINT_TABLET)
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
                href="#"
                className=" w-fit text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
              >
                <div className="mt-2 flex items-center gap-5  ">
                  <AiOutlineHome className="h-8 w-8" />
                </div>
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
              >
                <div className="mt-2 flex items-center gap-5  ">
                  <AiOutlineSearch className="h-8 w-8" />
                </div>
              </Sidebar.Item>
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
                href="/profile"
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
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    );
  //Sidemenu for desktop
  return (
    <div className="fixed top-0 left-0 h-full">
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className="w-80 border-x border-slate-300"
      >
        <div className="p-4">
          <Logo size="full" />
        </div>
        <Sidebar.Items className="mt-8">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="#"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <AiOutlineHome className="h-8 w-8" />
                Home
              </div>
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <AiOutlineSearch className="h-8 w-8" />
                Search
              </div>
            </Sidebar.Item>
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
              href="/profile"
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
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

const useWindowDimensions = () => {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
};
export { useWindowDimensions, SideMenu };
