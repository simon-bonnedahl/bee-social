import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@alfiejones/flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Resizer from "react-image-file-resizer";
import { CgSun, CgMoon } from "react-icons/cg";

type ThemeSwitchProps = {
  width?: string;
};
function ThemeSwitch(props: ThemeSwitchProps) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };
  return (
    <Sidebar.Item
      onClick={toggleDarkMode}
      className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
    >
      <div className="mt-2 flex items-center gap-5  ">
        {darkMode && <CgSun className="h-8 w-8 " />}
        {!darkMode && <CgMoon className="h-8 w-8 " />}

        {props.width && props.width === "full" && "Switch theme"}
      </div>
    </Sidebar.Item>
  );
}

export default ThemeSwitch;
