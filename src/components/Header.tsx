import type { FC } from "react";
import React from "react";
import netberryLogo from "../assets/netberry.png";
import Image from "next/image";
import Link from "next/link";

// interface HeaderProps {
//   children: React.ReactNode;
// }

const Header: FC = () => {
  return (
    <div className="header flex items-center justify-between py-8">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src={netberryLogo}
          alt="site-img"
          height={40}
          width={40}
          className="h-10 w-10"
        />{" "}
        <p className="text-2xl">
          <span className="font-bold">Net</span>Berry
        </p>
      </Link>
      <div className="flex">
        <button className="button bg-blue-lighter px-4 py-2 text-blue-dark hover:bg-blue-light">
          Login
        </button>
      </div>
    </div>
  );
};

export default Header;
