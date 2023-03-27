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

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <header className="bg-white-300 sticky top-0 z-50 flex items-center justify-between p-4 shadow-md">
      <Link href="/" className="flex items-center">
        <Image src={logo} alt="Logo" width={50} height={50} />
        <div className="text-xl font-bold">
          <span className="text-black">Bee </span>
          <span className="text-orange-400">Social</span>
        </div>
      </Link>
      <Searchbar />
      <div>
        {isSignedIn ? (
          <UserButton
            userProfileUrl="/profile"
            userProfileMode="navigation"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-12 w-12",

                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}

export default Header;
