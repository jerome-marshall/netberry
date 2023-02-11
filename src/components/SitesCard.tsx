/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FC } from "react";
import useSites from "../hooks/useSites";
import Card from "./Card";
import { SitesLandingURL } from "../utils/urls";
import RightArrow from "./RightArrow";

const SitesCard: FC = () => {
  const { sites } = useSites();

  return (
    <div className="col-span-8">
      <Card title="Sites" titleLink="/">
        {sites.map((site) => (
          <Link
            href={`${SitesLandingURL}/${site.id}`}
            key={site.id + site.name}
            className="card-item group justify-between"
          >
            <div className="flex gap-6">
              <img
                src={site.screenshot_url}
                alt=""
                className="max-h-16 rounded-medium"
              />
              <div className="flex flex-col justify-center">
                <p className="text-base font-semibold text-white">
                  {site.name}
                </p>
                <Link
                  href={site.url}
                  className="text-sm text-text-muted hover:underline "
                >
                  {site.url}
                </Link>
              </div>
            </div>
            <RightArrow />
          </Link>
        ))}
      </Card>
    </div>
  );
};

export default SitesCard;
