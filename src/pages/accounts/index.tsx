import Link from "next/link";
import React, { FC } from "react";
import RightArrow from "../../components/RightArrow";
import { api } from "../../utils/api";

const AccountsPage: FC = () => {
  const { data, isLoading } = api.sites.getAll.useQuery();
  console.log("🚀 ~ file: index.tsx:8 ~ data:", data);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sites-page bg-background-secondary py-card_pad">
      <div className="px-card_pad pb-card_pad">
        <h1>Accounts</h1>
        <div className="search-section"></div>
      </div>
      <div>
        {data.map((datum) => {
          const { account, sites } = datum;
          const siteText = sites.length === 1 ? "site" : "sites";

          return (
            <Link
              href={`/accounts/${account.slug}`}
              key={account.id + account.slug}
              className="card-item group cursor-pointer justify-between gap-6"
            >
              <div className="flex flex-col justify-center">
                <p className="text-base font-semibold text-white">
                  {account.name}
                </p>
                <p className="text-sm text-text-muted">{account.email}</p>
              </div>
              <div className=" flex items-center gap-6">
                <p className="relative -top-[1px] text-xs text-text-muted">
                  <span className="text-sm">{sites.length}</span> {siteText}
                </p>
                <RightArrow />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsPage;
