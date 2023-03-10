/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";
import type { SiteWithAccount } from "../types";
import Shimmer from "./Shimmer";

type Props = {
  site: SiteWithAccount;
};

const SitesListItemDetail: FC<Props> = ({ site }) => {
  return (
    <Link
      href={`/${site.account.slug}/${site.id}`}
      key={site.id + site.name}
      className="card-item cursor-pointer gap-6"
    >
      <img
        src={site.screenshot_url}
        alt=""
        className="max-h-16 rounded-medium"
      />
      <div className="flex flex-col justify-center">
        <p className="text-base font-semibold text-white">{site.name}</p>
        <Link
          href={site.url}
          className="text-sm text-text-muted hover:underline "
        >
          {site.url}
        </Link>
      </div>
    </Link>
  );
};

export default SitesListItemDetail;

export const SitesListItemDetailLoader: FC = () => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            className="card-item cursor-auto gap-6"
            key={"SitesListItemDetailLoader" + i.toString()}
          >
            <Shimmer className="h-16 w-[102px]" />
            <div className="flex flex-1 flex-col justify-center">
              <Shimmer className="h-5 w-[60%]" />
              <Shimmer className="mt-2 h-4 w-[40%]" />
            </div>
          </div>
        ))}
    </>
  );
};
