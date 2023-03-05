import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import { SiteWithAccount } from "../types";
import { api } from "../utils/api";
import {
  getDeployDuration,
  getDeployMessage,
  getDeployStatus,
  getDeployTime,
  getStatusTheme,
} from "../utils/deployUtils";
import Card from "./Card";
import RightArrow from "./RightArrow";
import Shimmer from "./Shimmer";

type Props = {
  siteInfo: SiteWithAccount | undefined;
};

const DeploysCard: FC<Props> = ({ siteInfo }) => {
  if (!siteInfo) return <DeploysCardLoader />;

  const {
    account: { slug },
    site_id,
  } = siteInfo;

  const { data } = api.deploys.getAll.useQuery({ site_id, account_slug: slug });

  if (!data) return <DeploysCardLoader />;

  return (
    <div className="mt-6">
      <Card title="Production Deploys" titleLink="">
        {data.map((deploy) => {
          const { status: deployStatus, theme } = getDeployStatus(deploy);

          const showStatus =
            (siteInfo.published_deploy?.id === deploy.id &&
              deployStatus === "published") ||
            deployStatus !== "published";

          const { id, context, branch, created_at, published_at, deploy_url } =
            deploy;
          return (
            <div
              key={id}
              className={clsx(
                "card-item group cursor-pointer justify-between gap-6",
                published_at && "card-item-muted"
              )}
            >
              <div className="">
                <div className="flex gap-2">
                  <p className="text-sm">
                    {published_at ? (
                      <Link
                        href={deploy_url}
                        className="font-semibold capitalize text-white underline decoration-text-muted hover:decoration-white hover:decoration-2"
                      >
                        {context}
                      </Link>
                    ) : (
                      <span className="capitalize">{context}</span>
                    )}
                    {": "}
                    {branch}@
                    <Link
                      href={""}
                      className="text-[80%] underline decoration-text-muted hover:text-white hover:decoration-white"
                    >
                      HEAD
                    </Link>
                  </p>
                  {showStatus && (
                    <p className={getStatusTheme(theme)}>{deployStatus}</p>
                  )}{" "}
                </div>
                <p className=" text-sm text-text-muted">
                  {getDeployMessage(deploy)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end justify-center">
                  <p
                    className={clsx(
                      "text-sm  ",
                      published_at
                        ? "font-bold text-white"
                        : "font-normal text-text-muted"
                    )}
                  >
                    {getDeployTime(created_at)}
                  </p>
                  {published_at && (
                    <p className="mt-1 text-xs text-text-muted">
                      Deployed in {getDeployDuration(created_at, published_at)}
                    </p>
                  )}
                </div>
                <RightArrow />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default DeploysCard;

export const DeploysCardLoader = () => {
  return (
    <div className="mt-6">
      <Card title="Production Deploys" titleLink="">
        {Array(7)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                key={"deployitem" + i.toString()}
                className={clsx(
                  "card-item group cursor-pointer justify-between gap-6"
                )}
              >
                <div className="">
                  <div className="flex gap-2">
                    <Shimmer className="h-4 w-[260px]" />
                  </div>
                  <Shimmer className="mt-2 h-3 w-[160px]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end justify-center">
                    <Shimmer className=" h-4 w-[160px]" />
                    <Shimmer className="mt-2 h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            );
          })}
      </Card>
    </div>
  );
};
