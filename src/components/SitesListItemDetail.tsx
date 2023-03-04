/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { FC } from "react";
import { NetlifyAccountNoToken, NetlifySite } from "../types";

type Props = {
  site: NetlifySite;
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
