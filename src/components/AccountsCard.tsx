import Link from "next/link";
import type { FC } from "react";
import { api } from "../utils/api";
import { AccountsLandingURL } from "../utils/urls";
import Card from "./Card";
import RightArrow from "./RightArrow";

const AccountsCard: FC = () => {
  const { data, isLoading } = api.accounts.getFavorites.useQuery();

  if (!data || isLoading) return <LoadingAccountsCard />;

  return (
    <div className="col-span-4">
      <Card title="Accounts" titleLink={AccountsLandingURL}>
        {data.slice(0, 5).map((account) => (
          <Link
            href={AccountsLandingURL + "/" + account.slug}
            key={account.id}
            className="card-item group justify-between gap-6"
          >
            <div className="">
              <p className="text-base font-semibold text-white">
                {account.name}
              </p>
              <p className="mt-1 text-sm text-text-muted">{account.email}</p>
            </div>

            <RightArrow />
          </Link>
        ))}
      </Card>
    </div>
  );
};

const LoadingAccountsCard: FC = () => (
  <div className="col-span-4">
    <Card title="Accounts">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          className="card-item group justify-between"
          key={i.toString() + "Accounts"}
        >
          <div className="flex w-full gap-6">
            <div className="flex w-full flex-col justify-center">
              <div className="h-5 w-[60%] animate-pulse rounded-[4px] bg-background-active_hover" />
              <div className="mt-2 h-4 w-[40%] animate-pulse rounded-[4px] bg-background-active_hover" />
            </div>
          </div>
          <RightArrow />
        </div>
      ))}
    </Card>
  </div>
);

export default AccountsCard;
