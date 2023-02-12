import type { FC } from "react";
import React from "react";
import netberryLogo from "../assets/netberry.png";
import Image from "next/image";
import Link from "next/link";
import { AccountsLandingURL, SitesLandingURL } from "../utils/urls";
import clsx from "clsx";
// interface HeaderProps {
//   children: React.ReactNode;
// }

const Header: FC = () => {
  const location = typeof window !== "undefined" && window.location;

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
      {location && (
        <div className="flex items-center gap-8">
          <Link
            href={SitesLandingURL}
            className={clsx(
              "nav-item",
              location?.pathname?.includes(SitesLandingURL) && "nav-item-active"
            )}
          >
            Sites
          </Link>
          <Link
            href={AccountsLandingURL}
            className={clsx(
              "nav-item",
              location?.pathname?.includes(AccountsLandingURL) &&
                "nav-item-active"
            )}
          >
            Accounts
          </Link>
          <button className="button bg-teal-light px-4 py-2 text-teal-dark hover:bg-teal-dark hover:text-teal-lighter">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
