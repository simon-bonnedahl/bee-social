import { Sidebar } from "@alfiejones/flowbite-react";
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

type SideMenuProps = {
  profileImageUrl: string;
};
function SideMenu(props: SideMenuProps) {
  return (
    <div className="fixed top-0 left-0 h-full">
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className=" w-80 border-x border-slate-300 "
      >
        <div className="p-4">
          <Logo size="full" />
        </div>
        <Sidebar.Items className="mt-8">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="#"
              className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <AiOutlineHome className="h-8 w-8 duration-200 ease-in-out hover:scale-110" />
                <span className="">Home</span>
              </div>
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <AiOutlineSearch className="h-8 w-8 duration-200 ease-in-out hover:scale-110" />
                <span className="">Search</span>
              </div>
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoPaperPlaneOutline className="h-7 w-7 duration-200 ease-in-out hover:scale-110" />
                <span className="">Messages</span>
              </div>
            </Sidebar.Item>
            <CreatePost size="full" />
            <Sidebar.Item
              href="#"
              className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <Image
                  className="rounded-full"
                  src={props.profileImageUrl}
                  alt="Profile Picture"
                  width={35}
                  height={35}
                />
                <span className="">Profile</span>
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="#"
              className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoSettingsOutline className="h-8 w-8 duration-200 ease-in-out hover:scale-110" />
                <span className="">Settings</span>
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

function SideMenuSmall(props: SideMenuProps) {
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
              href="#"
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <Image
                  className="h-8 w-8 rounded-full"
                  src={props.profileImageUrl}
                  alt="Profile Picture"
                  width={35}
                  height={35}
                />
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="#"
              className=" w-fit  text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
            >
              <div className="mt-2 flex items-center gap-5  ">
                <IoSettingsOutline className="h-8 w-8 duration-200 ease-in-out hover:scale-110" />
              </div>
            </Sidebar.Item>
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
export { useWindowDimensions, SideMenu, SideMenuSmall };
