import { CreateSiteURL, getSiteSettingsEnvURL } from "@/utils/urls";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { FC } from "react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  chooseSidebar?: "site" | "admin";
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children, chooseSidebar }) => {
  const { asPath, query } = useRouter();
  const account_slug = query.account_slug as string;
  const site_id = query.site_id as string;

  const siteSidebarData = [
    {
      title: "Environment varialbes",
      link: getSiteSettingsEnvURL(account_slug, site_id),
    },
  ];

  const adminSidebarData = [
    {
      title: "Create Site",
      link: CreateSiteURL,
    },
  ];

  let sidebarData = siteSidebarData;

  switch (chooseSidebar) {
    case "site":
      sidebarData = siteSidebarData;
      break;
    case "admin":
      sidebarData = adminSidebarData;
      break;
    default:
      sidebarData = siteSidebarData;
      break;
  }

  return (
    <div className="flex gap-8">
      <div className=" sticky top-6 flex h-fit min-h-[500px] min-w-[264px] flex-col space-y-2 rounded-medium border border-gray-light bg-background-secondary p-2">
        {sidebarData.map((item) => {
          const isActive = asPath === item.link;
          return (
            <Link
              href={item.link}
              className={cn("button-ghost justify-start", isActive && "active")}
              key={item.link + item.title}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default SidebarLayout;
