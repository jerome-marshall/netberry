/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FC } from "react";
import useSites from "../hooks/useSites";
import Card from "./Card";
import { SitesLandingURL } from "../utils/urls";

const SitesCard: FC = () => {
  const { sites } = useSites();
  console.log("🚀 ~ file: SitesCard.tsx:9 ~ sites", sites);

  return (
    <Card title="Sites" titleLink="/">
      {sites.map((site) => (
        <Link
          href={`${SitesLandingURL}/${site.id}`}
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
      ))}
    </Card>
  );
};

export default SitesCard;
