/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";
import type { SiteWithAccount } from "../types";
import Shimmer from "./Shimmer";
import SiteImg from "../assets/netlify-site.webp";
import Image from "next/image";

type Props = {
  site: SiteWithAccount;
};

const SitesListItemDetail: FC<Props> = ({ site }) => {
  const { account, id, name, screenshot_url, url, ssl_url } = site;

  return (
    <Link
      href={`/${account.slug}/${id}`}
      key={id + name}
      className="card-item cursor-pointer gap-6"
    >
      {screenshot_url ? (
        <img
          src={screenshot_url}
          alt=""
          className="max-h-16 max-w-[104px] rounded-medium"
        />
      ) : (
        <Image
          src={SiteImg}
          alt="site-img"
          height={104}
          width={168}
          className="max-h-16 max-w-[104px] rounded-medium"
        />
      )}
      <div className="flex flex-col justify-center">
        <p className="text-base font-semibold text-white">{name}</p>
        <Link
          href={ssl_url || url}
          className="text-sm text-text-muted hover:underline "
        >
          {url}
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
