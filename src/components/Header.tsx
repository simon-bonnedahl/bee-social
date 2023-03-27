import {
  SignIn,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import logo from "../../public/bee-social-logo.png";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <header className="bg-white-300 sticky top-0 z-50 flex items-center justify-between px-3 shadow-md">
      <div className="flex items-center">
        <div className="text-xl font-bold">
          <span className="text-orange-400">Bee </span>
          <span className="text-black">Social</span>
        </div>
        <Image src={logo} alt="Logo" width={100} height={100} />
      </div>
      <div>
        {isSignedIn ? (
          <UserButton
            userProfileUrl="/profile"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-16 w-16",

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
