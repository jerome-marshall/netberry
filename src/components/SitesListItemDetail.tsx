/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { FC } from "react";
import type { SiteWithAccount } from "../types";
import Shimmer from "./Shimmer";
import SiteImg from "../assets/netlify-site.webp";
import Image from "next/image";
import {
  getFrameworkInfo,
  getPublishedDate,
  getRepoProviderText,
} from "../common/utils";
import RightArrow from "./RightArrow";
import Tooltip from "./Tooltip";
import { AccountsLandingURL } from "../utils/urls";

type Props = {
  site: SiteWithAccount;
};

const SitesListItemDetail: FC<Props> = ({ site }) => {
  const {
    account,
    id,
    name,
    screenshot_url,
    build_settings,
    repo_url,
    published_deploy,
  } = site;

  const repoUrl = build_settings?.repo_url || repo_url;
  const framework = getFrameworkInfo(published_deploy?.framework);

  const { formatedDate, timeInterval } = getPublishedDate(
    published_deploy?.published_at
  );

  return (
    <Link
      href={`${AccountsLandingURL}/${account.slug}/${id}`}
      key={id + name}
      className="card-item group cursor-pointer "
    >
      <div className="flex gap-6">
        <div className="relative overflow-hidden rounded-medium">
          <div className="image-overlay"></div>
          {screenshot_url ? (
            <img
              src={screenshot_url}
              alt=""
              className="h-16 w-[104px] rounded-medium bg-gray-darkest"
            />
          ) : (
            <Image
              src={SiteImg}
              alt="site-img"
              height={104}
              width={168}
              className="h-16 w-[104px] rounded-medium bg-gray-darkest"
            />
          )}
        </div>
        <div className=" flex min-w-[340px] flex-col justify-center">
          <p className="text-base font-semibold text-white">{name}</p>
          {(repoUrl || framework) && (
            <div className="mt-0.5 text-sm text-text-muted">
              Deploys
              {repoUrl && (
                <Tooltip delay>
                  {" "}
                  from{" "}
                  <Link
                    href={repoUrl}
                    target="_blank"
                    className="relative z-10 underline hover:text-white"
                    data-tooltip-id="main-tooltip"
                    data-tooltip-content="ctrl + click to open"
                  >
                    {getRepoProviderText(build_settings?.provider)}
                  </Link>
                </Tooltip>
              )}
              {framework && (
                <>
                  {" "}
                  with
                  <span className="relative top-[1px] inline-flex items-center">
                    <framework.icon className="mx-1 h-3.5 w-3.5" />{" "}
                    {framework.name}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="ml-24 mr-auto flex min-w-[340px] flex-col justify-center">
        <p className="text-base text-white">
          Hosted at{" "}
          <Link
            href={`/accounts/${account.slug}`}
            className="text-[15px] font-semibold hover:underline"
            data-tooltip-id="main-tooltip"
            data-tooltip-content="ctrl + click to open"
          >
            {account.name}
          </Link>
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
      <RightArrow />
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
