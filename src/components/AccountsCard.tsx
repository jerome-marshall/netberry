import React, { FC } from "react";
import { api } from "../utils/api";
import Card from "./Card";
import { GoChevronRight } from "react-icons/go";
import clsx from "clsx";
import RightArrow from "./RightArrow";

const AccountsCard: FC = () => {
  const { data } = api.accounts.getAll.useQuery();
  console.log("🚀 ~ file: AccountsCard.tsx:7 ~ data", data);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="col-span-4">
      <Card title="Accounts" titleLink="/">
        {data.map((account) => (
          <div
            key={account.id}
            className="card-item group justify-between gap-6 px-4"
          >
            <div className="">
              <p className="text-base font-semibold text-white">
                {account.name}
              </p>
              <p className="mt-1 text-sm text-text-muted">{account.email}</p>
            </div>

            <RightArrow />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AccountsCard;
