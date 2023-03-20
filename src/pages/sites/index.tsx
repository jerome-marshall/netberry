/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import SitesListItemDetail, {
  SitesListItemDetailLoader,
} from "../../components/SitesListItemDetail";
import usePagination from "../../hooks/usePagination";
import useSearch from "../../hooks/useSearch";
import useSites from "../../hooks/useSites";
import { getServerSidePropsHelper } from "../../server/serverUtils";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  const { resultItems, ...searchProps } = useSearch({
    items: sites,
    keys: ["name", "url"],
  });

  const { currentItems, ...paginationProps } = usePagination({
    items: resultItems,
    itemsPerPage: 8,
  });

  return (
    <>
      <NextSeo title="Sites" />
      <div className="sites-page bg-background-secondary py-card_pad">
        <div className="flex items-center justify-between gap-20 px-card_pad pb-card_pad">
          <h1>Sites</h1>
          {sites && <Search {...searchProps} />}
        </div>
        <div>
          {sites && resultItems ? (
            currentItems.length === 0 ? (
              <div className="card-item hover:cursor-default">
                <p className="text-base font-semibold text-white">
                  No results found
                </p>
              </div>
            ) : (
              currentItems.map((site, index) => (
                <SitesListItemDetail
                  key={site.id + index.toString()}
                  site={site}
                />
              ))
            )
          ) : (
            <SitesListItemDetailLoader />
          )}
        </div>
      </div>
      <Pagination {...paginationProps} />
    </>
  );
};

export default SitesPage;

// export const getServerSideProps = getServerSidePropsHelper;
