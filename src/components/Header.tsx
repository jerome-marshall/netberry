/* eslint-disable @next/next/no-img-element */
import { FC, useEffect } from "react";
import React from "react";
import netberryLogo from "../assets/netberry.png";
import Image from "next/image";
import Link from "next/link";
import { AccountsLandingURL, SitesLandingURL } from "../utils/urls";
import { useSession, signIn, signOut } from "next-auth/react";
import clsx from "clsx";
import { Menu } from "@headlessui/react";

// interface HeaderProps {
//   children: React.ReactNode;
// }

const Header: FC = () => {
  const [location, setLocation] = React.useState<Location>();

  useEffect(() => {
    setLocation(window.location);
  }, []);

  const { data, status } = useSession();

  const isAuthenticated = status === "authenticated";

  const userImage = data?.user?.image;

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
          <div className="relative">
            {isAuthenticated ? (
              <Menu>
                <Menu.Button>
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="user"
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray" />
                  )}
                </Menu.Button>
                <Menu.Items
                  className={
                    "absolute top-14 right-0 bg-background-active_hover"
                  }
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
            ) : (
              <button
                className="button-teal"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => {
                  signOut()
                    .then(() => console.log("Signed out"))
                    .catch((err) => console.log(err));
                }}
              >
                {"Sign In"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
