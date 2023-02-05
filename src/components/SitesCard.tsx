/* eslint-disable @next/next/no-img-element */
import type { FC } from "react";
import React from "react";
import Card from "./Card";
import type { NetlifySite } from "../types";
import Link from "next/link";

interface SitesCardProps {
  sites: NetlifySite[];
}

const SitesCard: FC<SitesCardProps> = ({ sites }) => {
  console.log("🚀 ~ file: SitesCard.tsx:10 ~ sites", sites);
  return (
    <Card title="Sites" titleLink="/">
      {sites.map((site) => (
        <div key={site.id} className="card-item cursor-pointer gap-6">
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
        </div>
      ))}
    </Card>
  );
};

export default SitesCard;
