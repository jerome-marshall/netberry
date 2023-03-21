/* eslint-disable @next/next/no-img-element */
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { BiAddToQueue } from "react-icons/bi";
import SiteImg from "../assets/netlify-site.webp";
import usePagination from "../hooks/usePagination";
import { api } from "../utils/api";
import { SitesLandingURL } from "../utils/urls";
import Card from "./Card";
import Pagination from "./Pagination";
import RightArrow from "./RightArrow";
import Shimmer from "./Shimmer";

const SitesCard: FC = () => {
  const { data, isLoading } = api.sites.getFavorites.useQuery();

  const pagination = usePagination({
    items: data,
    itemsPerPage: 8,
  });

  if (isLoading || !data) return <LoadingSitesCard />;

  return (
    <div className="col-span-8">
      <Card title="Sites" titleLink={SitesLandingURL}>
        {_.isEmpty(data) ? (
          <Link
            href={SitesLandingURL}
            className="flex flex-col justify-center px-card_pad text-text-muted transition-all duration-200 hover:text-white/90"
          >
            <BiAddToQueue className="h-full max-h-40 w-full " />
            <p className="mt-4 text-center text-base font-semibold ">
              Your favorite sites will appear here.
            </p>
          </Link>
        ) : (
          pagination.currentItems.map((site) => (
            <Link
              href={`${site.account.slug}/${site.id}`}
              key={site.id + site.name}
              className="card-item group justify-between"
            >
              <div className=" flex gap-6">
                <div className="relative overflow-hidden rounded-medium">
                  <div className="image-overlay"></div>
                  {site.screenshot_url ? (
                    <img
                      src={site.screenshot_url}
                      alt=""
                      className="h-16 w-[104px] rounded-medium"
                    />
                  ) : (
                    <Image
                      src={SiteImg}
                      alt="site-img"
                      height={104}
                      width={168}
                      className="h-16 w-[104px] rounded-medium"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-base font-semibold text-white">
                    {site.name}
                  </p>
                  <Link
                    href={site.ssl_url || site.url}
                    target="_blank"
                    className="text-sm text-text-muted hover:underline "
                    data-tooltip-id="main-tooltip"
                    data-tooltip-content="ctrl + click to open"
                  >
                    {site.ssl_url || site.url}
                  </Link>
                </div>
              </div>
              <RightArrow />
            </Link>
          ))
        )}
      </Card>
      <Pagination {...pagination} />
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
