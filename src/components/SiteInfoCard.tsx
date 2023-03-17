/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { format } from "date-fns";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import { FaBolt } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import { SiNetlify } from "react-icons/si";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteImg from "../assets/netlify-site.webp";
import { getRepoProviderText } from "../common/utils";
import type { SiteWithAccount } from "../types";
import { api } from "../utils/api";
import EnvModal from "./EnvModal";
import Shimmer from "./Shimmer";

type Props = {
  siteInfo: SiteWithAccount | undefined;
  refetchDeploys: (() => void | undefined) | null;
};

const SiteInfoCard: FC<Props> = ({ siteInfo, refetchDeploys }) => {
  let toastId: Id | null = null;

  const [trigerring, setTrigerring] = useState(false);

  const { mutate, data, error } = api.deploys.triggerBuild.useMutation({
    onMutate(variables) {
      const id = toast.loading("Please wait...");
      toastId = id;
    },
    onSuccess() {
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Build triggered successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });

        toastId = null;
        setTrigerring(false);
      }, 1000);
    },
    onError() {
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });

        toastId = null;
        setTrigerring(false);
      }, 1000);
    },

    onSettled() {
      refetchDeploys?.();
    },
  });

  if (!siteInfo) return <SiteInfoLoader />;

  const {
    published_deploy,
    url,
    ssl_url,
    name,
    screenshot_url,
    id,
    admin_url,
    repo_url,
    build_settings,
    account,
  } = siteInfo;
  console.log("🚀 ~ file: SiteInfoCard.tsx:87 ~ siteInfo:", siteInfo);

  const repoUrl = build_settings?.repo_url || repo_url;

  const formatedDate =
    published_deploy?.published_at &&
    format(new Date(published_deploy?.published_at), "LLL dd");

  const triggerBuild = ({ clearCache }: { clearCache: boolean }) => {
    mutate({
      clear_cache: clearCache,
      site_id: id,
      account_slug: siteInfo.account.slug,
    });

    setTrigerring(true);
  };

  const envs = siteInfo.build_settings?.env;

  return (
    <div className="site-info-card min-w-[640px] max-w-fit rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between gap-32">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">{name}</h1>
          <Link
            href={ssl_url || url}
            target="_blank"
            className="mt-1 text-base text-teal-light underline-offset-2 hover:underline"
          >
            {ssl_url || url}
          </Link>
          {repoUrl && (
            <p className=" text-text-muted">
              Deploys from{" "}
              <Link
                href={repoUrl}
                target="_blank"
                className="underline hover:text-white"
              >
                {getRepoProviderText(build_settings?.provider)}
              </Link>
              .
            </p>
          )}
          <p className=" text-text-muted">Hosted at {account.email}. </p>
          <p className=" text-text-muted">
            {formatedDate ? (
              <>Last published on {formatedDate}.</>
            ) : (
              <>No deploys yet.</>
            )}
          </p>
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
        <Link href={admin_url} target="_blank" className={clsx("button gap-2")}>
          <SiNetlify />
          <span>Open in Netlify</span>
        </Link>
        <button
          className={clsx(
            "button gap-2",
            toastId && "cursor-not-allowed bg-blue-light"
          )}
          onClick={() => triggerBuild({ clearCache: false })}
          disabled={trigerring}
        >
          <FaBolt />
          <span>Trigger build</span>
        </button>
        <button
          className={clsx("button gap-2 ")}
          onClick={() => triggerBuild({ clearCache: true })}
          disabled={trigerring}
        >
          <MdCleaningServices />
          <span>Clear cache and build</span>
        </button>
        {!_.isEmpty(envs) && <EnvModal envs={envs} />}
      </div>
    </div>
  );
};

export default SiteInfoCard;

export const SiteInfoLoader = () => {
  return (
    <div className="site-info-card max-w-fit rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Shimmer className="h-8 w-[300px]" />
          <Shimmer className="h-5 w-[300px]" />
          <Shimmer className="h-4 w-[240px]" />
          <Shimmer className="h-4 w-[240px]" />
          <Shimmer className="h-4 w-[240px]" />
        </div>
        <div className="image-section relative h-[104px] w-[168px] overflow-hidden rounded-medium">
          <Shimmer className="h-[104px] w-[168px]" />
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <Shimmer className="h-8 w-[140px]" />
        <Shimmer className="h-8 w-[140px]" />
        <Shimmer className="h-8 w-[140px]" />
        <Shimmer className="h-8 w-[140px]" />
      </div>
    </div>
  );
};
