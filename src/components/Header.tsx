import {
  SignIn,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/bee-social-logo.png";
import Searchbar from "./Searchbar";
import ThemeSwitch from "./ThemeSwitch";
import CreatePost from "./CreatePost";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-md dark:bg-gray-700">
      <Link href="/" className="flex items-center gap-x-4">
        <Image src={logo} alt="Logo" width={50} height={50} />
        <div className="text-xl font-bold">
          <span className="text-gray-700 dark:text-white">Bee </span>
          <span className="text-orange-400">Social</span>
        </div>
      </Link>
      <Searchbar />
      <div className="flex items-center gap-x-3">
        {isSignedIn && <CreatePost />}
        {isSignedIn ? (
          <UserButton
            userProfileUrl="/profile"
            userProfileMode="navigation"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-12 w-12",
                userButtonPopoverCard: "border-2 border-orange-400",

                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        ) : (
          <SignInButton />
        )}
        <ThemeSwitch />
      </div>
    </header>
  );
}

export default Header;
