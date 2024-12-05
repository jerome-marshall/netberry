import _ from "lodash";
import Link from "next/link";
import type { FC } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import usePagination from "../hooks/usePagination";
import { api } from "../utils/api";
import { AccountsLandingURL } from "../utils/urls";
import Card from "./Card";
import Pagination from "./Pagination";
import RightArrow from "./RightArrow";

const AccountsCard: FC = () => {
  const { data, isLoading } = api.accounts.getFavorites.useQuery(undefined, {
    retry: 2,
  });

  const pagination = usePagination({
    items: data,
    itemsPerPage: 8,
  });

  if (!data || isLoading) return <LoadingAccountsCard />;

  return (
    <div className="col-span-4">
      <Card title="Accounts" titleLink={AccountsLandingURL}>
        {_.isEmpty(data) ? (
          <Link
            href={AccountsLandingURL}
            className="flex flex-col justify-center px-card_pad text-text-muted transition-all duration-200 hover:text-white/90"
          >
            <AiOutlineUsergroupAdd className="h-full max-h-40 w-full" />
            <p className="mt-4 text-center text-base font-semibold">
              Your favorite accounts will appear here.
            </p>
          </Link>
        ) : (
          pagination.currentItems.map((account) => (
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
          ))
        )}
      </Card>
      <Pagination {...pagination} />
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
