/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect } from "react";
import { useState } from "react";
import { FaBolt } from "react-icons/fa";
import { SiNetlify } from "react-icons/si";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteImg from "../assets/netlify-site.webp";
import { getRepoProviderText } from "../common/utils";
import type { SiteWithAccount } from "../types";
import { api } from "../utils/api";
import EnvModal from "./EnvModal";
import MenuDropdown from "./MenuDropdown";
import Shimmer from "./Shimmer";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

type Props = {
  siteInfo: SiteWithAccount | undefined;
  refetchDeploys: (() => void | undefined) | null;
};

const SiteInfoCard: FC<Props> = ({ siteInfo, refetchDeploys }) => {
  console.log("🚀 ~ file: SiteInfoCard.tsx:29 ~ siteInfo:", siteInfo);
  let toastId: Id | null = null;

  const [isFav, setIsFav] = useState(siteInfo?.isFavourite || false);
  const [favLoading, setFavLoading] = useState(!siteInfo);

  useEffect(() => {
    if (siteInfo) {
      setIsFav(!!siteInfo.isFavourite);
    }
    setFavLoading(!siteInfo);
  }, [siteInfo]);

  const [trigerring, setTrigerring] = useState(false);

  const { mutate } = api.deploys.triggerBuild.useMutation({
    onMutate() {
      const id = toast.loading("Hold on...");
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

  const { mutate: addFavorite } = api.sites.addFavorite.useMutation({
    onMutate() {
      setFavLoading(true);
      const id = toast.loading("Adding to favourites...");
      toastId = id;
    },
    onSuccess() {
      setIsFav(true);
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Added to favourites",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
      }, 1000);
    },
    onError() {
      setIsFav(false);
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Failed to favourite",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
      }, 1000);
    },
    onSettled() {
      setFavLoading(false);
    },
  });

  const { mutate: removeFavorite } = api.sites.removeFavorite.useMutation({
    onMutate() {
      setFavLoading(true);
      const id = toast.loading("Removing favourite...");
      toastId = id;
    },
    onSuccess() {
      setIsFav(false);
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Removed from favourites",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
      }, 1000);
    },
    onError() {
      setIsFav(true);
      setTimeout(() => {
        toastId &&
          toast.update(toastId, {
            render: "Failed to unfavourite",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
      }, 1000);
    },
    onSettled() {
      setFavLoading(false);
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

  const handleFavourite = (type: "ADD" | "REMOVE") => {
    switch (type) {
      case "ADD":
        addFavorite({
          site_id: id,
          account_slug: siteInfo.account.slug,
        });
        setIsFav(true);
        break;
      case "REMOVE":
        removeFavorite({
          site_id: id,
        });
        setIsFav(false);
        break;
    }
  };

  return (
    <div className="site-info-card min-w-[640px] max-w-fit rounded-medium border border-gray-darkest bg-background-secondary p-card_pad">
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
              <>No published deploys yet.</>
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

        <MenuDropdown
          Button={
            <div className="flex items-center gap-2 text-white">
              <FaBolt />
              Trigger Deploy
            </div>
          }
          dropdownButtons={[
            <button
              className={clsx("flex w-full items-center gap-2 text-base")}
              onClick={() => triggerBuild({ clearCache: false })}
              key="trigger-build"
            >
              <span>Deploy site</span>
            </button>,
            <button
              className={clsx("flex w-full items-center gap-2 text-base")}
              onClick={() => triggerBuild({ clearCache: true })}
              key="clear-cache"
            >
              <span>Clear cache deploy site</span>
            </button>,
          ]}
          disabled={trigerring}
        />
        <EnvModal envs={envs} site={siteInfo} />
        {isFav ? (
          <button
            className="button items-center gap-2"
            onClick={() => handleFavourite("REMOVE")}
            disabled={favLoading}
          >
            <AiFillStar />
            <span>Remove</span>
          </button>
        ) : (
          <button
            className="button items-center gap-2"
            onClick={() => handleFavourite("ADD")}
            disabled={favLoading}
          >
            <AiOutlineStar />
            <span>Add to Fav</span>
          </button>
        )}
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
