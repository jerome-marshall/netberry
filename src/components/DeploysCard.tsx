import React, { FC } from "react";
import { api } from "../utils/api";
import Card from "./Card";
import Link from "next/link";
import {
  getDeployDuration,
  getDeployMessage,
  getDeployStatus,
  getDeployTime,
  getStatusTheme,
} from "../utils/deployUtils";
import clsx from "clsx";

type Props = {
  site_id: string;
};

const DeploysCard: FC<Props> = ({ site_id }) => {
  const { data } = api.deploy.getAll.useQuery({ site_id });
  console.log("🚀 ~ file: DeploysCard.tsx:10 ~ data", data);

  if (!data) return null;
  return (
    <div className="mt-6">
      <Card title="Production Deploys" titleLink="">
        {data.map((deploy) => {
          const { status: deployStatus, theme } = getDeployStatus(deploy);

          const { id, context, branch, created_at, published_at, deploy_url } =
            deploy;
          return (
            <div
              key={id}
              className={clsx(
                "card-item cursor-pointer justify-between gap-6",
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
                  <p className={getStatusTheme(theme)}>{deployStatus}</p>
                </div>
                <p className=" text-sm text-text-muted">
                  {getDeployMessage(deploy)}
                </p>
              </div>
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
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default DeploysCard;
