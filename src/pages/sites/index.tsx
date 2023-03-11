/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Pagination from "../../components/Pagination";
import SitesListItemDetail, {
  SitesListItemDetailLoader,
} from "../../components/SitesListItemDetail";
import usePagination from "../../hooks/usePagination";
import useSites from "../../hooks/useSites";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  const paginationProps = usePagination({
    items: sites,
    itemsPerPage: 8,
  });

  const { currentItems } = paginationProps;

  return (
    <>
      <div className="sites-page bg-background-secondary py-card_pad">
        <div className="px-card_pad pb-card_pad">
          <h1>Sites</h1>
          <div className="search-section"></div>
        </div>
        <div>
          {sites ? (
            currentItems.map((site) => (
              <SitesListItemDetail key={site.id} site={site} />
            ))
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
