import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import logo from "../../public/bee-social-logo.png";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <header className="sticky top-0 z-50 flex justify-between bg-orange-300 p-5 shadow-md">
      <div>
        {isSignedIn ? (
          <>
            <h1 className="text-xl font-bold text-black">
              Hello {user.firstName}
            </h1>

            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>

      <Image src={logo} alt="Logo" width={100} height={100} />
    </header>
  );
}

export default Header;
