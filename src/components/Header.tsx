/* eslint-disable @next/next/no-img-element */
import { Menu } from "@headlessui/react";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React, { useEffect } from "react";
import netberryLogo from "../assets/netberry.png";
import { AccountsLandingURL, SitesLandingURL } from "../utils/urls";

const Header: FC = () => {
  const [location, setLocation] = React.useState<Location>();

  useEffect(() => {
    setLocation(window.location);
  }, []);

  const { data, status } = useSession();

  const userImage = data?.user?.image;

  return (
    <div className="header flex items-center justify-between py-8">
      {status === "authenticated" ? (
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
      ) : (
        <div className="h-11"></div>
      )}
      {location && status === "authenticated" && (
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
          <div className="relative">
            <Menu>
              <Menu.Button>
                {userImage ? (
                  <img
                    src={userImage}
                    alt="user"
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-light" />
                )}
              </Menu.Button>
              <Menu.Items
                className={"absolute top-14 right-0 bg-background-active_hover"}
              >
                <Menu.Item>
                  <button
                    onClick={() => {
                      signOut()
                        .then(() => console.log("Signed out"))
                        .catch((err) => console.log(err));
                    }}
                    className="button"
                  >
                    Logout
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
