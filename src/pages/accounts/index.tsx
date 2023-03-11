import Link from "next/link";
import type { FC } from "react";
import Pagination from "../../components/Pagination";
import RightArrow from "../../components/RightArrow";
import Shimmer from "../../components/Shimmer";
import usePagination from "../../hooks/usePagination";
import { api } from "../../utils/api";

const AccountsPage: FC = () => {
  const { data, isLoading } = api.sites.getAll.useQuery();

  const pagination = usePagination({
    items: data,
  });

  return (
    <>
      <div className="sites-page bg-background-secondary py-card_pad">
        <div className="px-card_pad pb-card_pad">
          <h1>Accounts</h1>
          <div className="search-section"></div>
        </div>
        <div>
          {data
            ? pagination.currentItems.map((datum) => {
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
                        <span className="text-sm">{sites.length}</span>{" "}
                        {siteText}
                      </p>
                      <RightArrow />
                    </div>
                  </Link>
                );
              })
            : Array.from({ length: 5 }).map((_, i) => (
                <div
                  className="card-item group justify-between"
                  key={i.toString() + "site"}
                >
                  <div className="flex w-full gap-6">
                    <div className="flex w-full flex-col justify-center">
                      <Shimmer height="md" width="sm" />
                      <Shimmer height="sm" width="xs" className="mt-2" />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <Pagination {...pagination} />
    </>
  );
};

export default AccountsPage;
