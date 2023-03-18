/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";
import useSites from "../hooks/useSites";
import { SitesLandingURL } from "../utils/urls";
import Card from "./Card";
import RightArrow from "./RightArrow";
import Shimmer from "./Shimmer";
import SiteImg from "../assets/netlify-site.webp";
import Image from "next/image";
import { api } from "../utils/api";

const SitesCard: FC = () => {
  // const { sites, isLoading } = useSites();

  const { data, isLoading } = api.sites.getFavorites.useQuery();
  console.log("🚀 ~ file: SitesCard.tsx:17 ~ data:", data);
  if (isLoading || !data) return <LoadingSitesCard />;

  return (
    <div className="col-span-8">
      <Card title="Sites" titleLink={SitesLandingURL}>
        {data.slice(0, 10).map((site) => (
          <Link
            href={`${site.account.slug}/${site.id}`}
            key={site.id + site.name}
            className="card-item group justify-between"
          >
            <div className="flex gap-6">
              {site.screenshot_url ? (
                <img
                  src={site.screenshot_url}
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
                <p className="text-base font-semibold text-white">
                  {site.name}
                </p>
                <Link
                  href={site.ssl_url || site.url}
                  target="_blank"
                  className="text-sm text-text-muted hover:underline "
                >
                  {site.ssl_url || site.url}
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
              <Shimmer height="md" width="md" />
              <Shimmer height="sm" width="sm" className="mt-2" />
            </div>
          </div>
          <RightArrow />
        </div>
      ))}
    </Card>
  </div>
);

export default SitesCard;
