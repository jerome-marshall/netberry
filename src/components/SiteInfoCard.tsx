/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";
import React from "react";
import type { Site, SiteWithAccount } from "../types";
import { format } from "date-fns";
import { SiNetlify } from "react-icons/si";
import { FaBolt } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import { api } from "../utils/api";
import SiteImg from "../assets/netlify-site.png";
import Image from "next/image";
import _ from "lodash";
import { getRepoProviderText } from "../common/utils";

type Props = {
  siteInfo: SiteWithAccount;
};

const SiteInfoCard: FC<Props> = ({ siteInfo }) => {
  const { mutate, data, error } = api.deploys.triggerBuild.useMutation();
  console.log("🚀 ~ file: SiteInfoCard.tsx:24 ~ error:", error);

  const {
    published_deploy,
    url,
    name,
    screenshot_url,
    id,
    admin_url,
    repo_url,
    build_settings,
  } = siteInfo;

  const repoUrl = build_settings?.repo_url || repo_url;

  const formatedDate = format(
    new Date(published_deploy?.published_at),
    "LLL dd"
  );

  const triggerBuild = ({ clearCache }: { clearCache: boolean }) => {
    mutate({
      clear_cache: clearCache,
      site_id: id,
      account_slug: siteInfo.account.slug,
    });
  };

  return (
    <div className="site-info-card max-w-2xl rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">{name}</h1>
          <Link
            href={url}
            className="mt-1 text-base text-teal-light underline-offset-2 hover:underline"
          >
            {url}
          </Link>
          {repoUrl && (
            <p className=" text-text-muted">
              Deploys from{" "}
              <Link href={repoUrl} className="underline hover:text-white">
                {getRepoProviderText(build_settings?.provider)}
              </Link>
              .
            </p>
          )}
          <p className=" text-text-muted">Last published on {formatedDate}.</p>
        </div>
        <Link
          href={url}
          className="image-section relative h-[104px] w-[168px] overflow-hidden rounded-medium"
        >
          {screenshot_url ? (
            <img
              src={screenshot_url}
              alt="site-img"
              className="h-full w-full"
            />
          ) : (
            <Image
              src={SiteImg}
              alt="site-img"
              height={104}
              width={168}
              className="h-full w-full"
            />
          )}
          <div className="absolute inset-0 h-full w-full bg-background-primary opacity-10 transition-all duration-200 hover:opacity-0"></div>
        </Link>
      </div>
      <div className="mt-6 flex gap-4">
        <Link
          href={admin_url}
          target="_blank"
          className="button flex items-center gap-2"
        >
          <SiNetlify />
          <span>Open in Netlify</span>
        </Link>
        <button
          className="button flex items-center gap-2"
          onClick={() => triggerBuild({ clearCache: false })}
        >
          <FaBolt />
          <span>Trigger build</span>
        </button>
        <button
          className="button flex items-center gap-2"
          onClick={() => triggerBuild({ clearCache: true })}
        >
          <MdCleaningServices />
          <span>Clear cache and build</span>
        </button>
      </div>
    </div>
  );
};

export default SiteInfoCard;
