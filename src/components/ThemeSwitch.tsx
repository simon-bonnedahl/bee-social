import { Sidebar } from "@alfiejones/flowbite-react";
import { useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

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
        {darkMode && <BsSun className="h-7 w-7 " />}
        {!darkMode && <BsMoon className="h-7 w-7 " />}

        {props.width && props.width === "full" && "Switch theme"}
      </div>
    </Sidebar.Item>
  );
}

export default ThemeSwitch;
