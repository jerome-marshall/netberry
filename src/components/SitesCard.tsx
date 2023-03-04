/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FC } from "react";
import useSites from "../hooks/useSites";
import { SitesLandingURL } from "../utils/urls";
import Card from "./Card";
import RightArrow from "./RightArrow";
import ShimmerText from "./shimmer/elements/ShimmerText";

const SitesCard: FC = () => {
  const { sites, isLoading, error } = useSites();
  if (isLoading || !sites) return <LoadingSitesCard />;

  return (
    <div className="col-span-8">
      <Card title="Sites" titleLink={SitesLandingURL}>
        {sites.map((site) => (
          <Link
            href={`${site.account.slug}/${site.id}`}
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

const LoadingSitesCard: FC = () => (
  <div className="col-span-8">
    <Card title="Sites">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          className="card-item group justify-between"
          key={i.toString() + "site"}
        >
          <div className="flex w-full gap-6">
            <div className="h-16 w-36 animate-pulse rounded-medium bg-background-active_hover" />
            <div className="flex w-full flex-col justify-center">
              <ShimmerText height="md" width="md" />
              <ShimmerText height="sm" width="sm" className="mt-2" />
            </div>
          </div>
          <RightArrow />
        </div>
      ))}
    </Card>
  </div>
);

export default SitesCard;
