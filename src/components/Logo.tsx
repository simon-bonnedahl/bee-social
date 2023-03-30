import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/bee-social-logo.png";

type LogoProps = {
  size?: string;
};

function Logo(props: LogoProps) {
  return (
    <div>
      <Link href="/" className="flex items-center gap-x-4">
        <Image src={logo} alt="Logo" width={40} height={40} />
        {props.size === "full" && (
          <div className="text-xl font-semibold">
            <span className="text-gray-700 dark:text-white">Bee </span>
            <span className="text-orange-400">Social</span>
          </div>
        )}
      </Link>
    </div>
  );
}

export default Logo;
