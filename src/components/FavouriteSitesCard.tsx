/* eslint-disable @next/next/no-img-element */
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC, useEffect, use } from "react";
import { BiAddToQueue } from "react-icons/bi";
import SiteImg from "../assets/netlify-site.webp";
import { getPublishedDate, sortSites } from "../common/utils";
import usePagination from "../hooks/usePagination";
import { api } from "../utils/api";
import { AccountsLandingURL, SitesLandingURL } from "../utils/urls";
import Card from "./Card";
import Pagination from "./Pagination";
import RightArrow from "./RightArrow";
import Shimmer from "./Shimmer";
import type { AccountNoToken, Site } from "../types";

const FavouriteSitesCard: FC = () => {
  const [data, setData] = useState<
    (Site & {
      account: AccountNoToken;
      isFavourite?: boolean | undefined;
    })[]
  >();
  const [timestamp, setTimestamp] = useState<number | undefined>();

  const { data: favData, isLoading } = api.sites.getFavorites.useQuery(
    undefined,
    {
      retry: 2,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
      initialData: data,
      initialDataUpdatedAt: timestamp,
    }
  );

  useEffect(() => {
    if (favData) {
      setData(favData);

      // set favData in localStorage with timestamp
      localStorage.setItem(
        "favData",
        JSON.stringify({
          data: favData,
          timestamp: Date.now(),
        })
      );
    } else {
      // get favData from localStorage
      const localFavData = localStorage.getItem("favData");
      if (localFavData) {
        const { data: localFav, timestamp } = JSON.parse(localFavData) as {
          data: typeof data;
          timestamp: number;
        };
        setData(localFav);
        setTimestamp(timestamp);
      }
    }
  }, [favData]);

  data?.sort(sortSites);

  const pagination = usePagination({
    items: data,
    itemsPerPage: 8,
  });

  if (!data) return <LoadingSitesCard />;

  return (
    <div className="col-span-6">
      <Card title="Favourite sites">
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
          pagination.currentItems.map((site) => {
            const { formatedDate, timeInterval } = getPublishedDate(
              site.published_deploy.published_at
            );

            return (
              <Link
                href={`${AccountsLandingURL}/${site.account.slug}/${site.id}`}
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

                    <div className="mt-0.5 text-sm text-text-muted">
                      {formatedDate ? (
                        <>
                          Last published at {formatedDate} ({timeInterval})
                        </>
                      ) : (
                        "Not published yet"
                      )}
                    </div>
                  </div>
                </div>
                <RightArrow />
              </Link>
            );
          })
        )}
      </Card>
      <Pagination {...pagination} />
    </div>
  );
};

const LoadingSitesCard: FC = () => (
  <div className="col-span-6">
    <Card title="Favourite sites">
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

export default FavouriteSitesCard;