import React, { FC } from "react";
import { api } from "../utils/api";
import Card from "./Card";
import Link from "next/link";

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
        {data.map((deploy) => (
          <div
            key={deploy.id}
            className="card-item cursor-pointer justify-between gap-6"
          >
            <div className="">
              <div className="flex gap-2">
                <p className="text-sm">
                  <span className="capitalize">{deploy.context}:</span>{" "}
                  {deploy.branch}@<Link href={""}>HEAD</Link>
                </p>
                <p className="status-grey">Published</p>
              </div>
              <p className=" text-sm text-text-muted">No deploy message</p>
            </div>
            <div className="flex flex-col items-end justify-center">
              <p className="text-sm font-bold text-white">Today at 8:15 PM</p>
              <p className="mt-1 text-xs text-text-muted">Deployed in 1 mins</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default DeploysCard;
