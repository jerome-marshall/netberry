/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { FC } from "react";
import { NetlifySite } from "../types";
import { format } from "date-fns";
import { SiNetlify } from "react-icons/si";
import { FaBolt } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import { api } from "../utils/api";

type Props = {
  siteInfo: NetlifySite;
};

const SiteInfoCard: FC<Props> = ({ siteInfo }) => {
  console.log("🚀 ~ file: SiteInfoCard.tsx:16 ~ siteInfo", siteInfo);
  const formatedDate = format(
    new Date(siteInfo.published_deploy.published_at),
    "LLL dd"
  );

  const { mutate } = api.deploy.triggerBuild.useMutation();

  return (
    <div className="site-info-card max-w-2xl rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">{siteInfo.name}</h1>
          <Link
            href={siteInfo.url}
            className="mt-1 text-base text-teal-light underline-offset-2 hover:underline"
          >
            {siteInfo.url}
          </Link>
          <p className=" text-text-muted">
            Deploys from{" "}
            <Link
              href={siteInfo.build_settings.repo_url}
              className="underline hover:text-white"
            >
              {siteInfo.build_settings.provider === "github"
                ? "GitHub"
                : siteInfo.build_settings.provider}
            </Link>
            .
          </p>
          <p className=" text-text-muted">Last published on {formatedDate}.</p>
        </div>
        <img
          src={siteInfo.screenshot_url}
          alt="site-img"
          className="h-[104px] w-[168px] rounded-medium"
        />
      </div>
      <div className="mt-6 flex gap-4">
        <Link href={""} className="button flex items-center gap-2">
          <SiNetlify />
          <span>Open in Netlify</span>
        </Link>
        <button
          className="button flex items-center gap-2"
          onClick={() => {
            const res = mutate({
              clear_cache: true,
              site_id: siteInfo.id,
            });
          }}
        >
          <FaBolt />
          <span>Trigger build</span>
        </button>
        <Link href={""} className="button flex items-center gap-2">
          <MdCleaningServices />
          <span>Clear cache and build</span>
        </Link>
      </div>
    </div>
  );
};

export default SiteInfoCard;
