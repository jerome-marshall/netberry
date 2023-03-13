/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import SitesListItemDetail, {
  SitesListItemDetailLoader,
} from "../../components/SitesListItemDetail";
import usePagination from "../../hooks/usePagination";
import useSites from "../../hooks/useSites";
import Fuse from "fuse.js";
import { SiteWithAccount } from "../../types";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  const [fuse, setFuse] = useState<Fuse<SiteWithAccount> | null>(null);
  const [searchText, setSearchText] = useState("");
  const [resultItems, setResultItems] = useState(sites);

  useEffect(() => {
    if (!sites) return;
    setResultItems(sites);

    const fuse = new Fuse(sites, {
      keys: ["name", "url"],
      ignoreLocation: true,
      threshold: 0.4,
      includeScore: true,
    });

    setFuse(fuse);
  }, [sites]);

  const handleSearch = (val: string) => {
    if (!sites && !fuse) return;

    setSearchText(val);

    // if search string is empty return all faqs
    if (val === "") return setResultItems(sites);

    // search for the val and only get the item
    const result = fuse?.search(val).map((item) => item.item);
    setResultItems(result);
  };

  const paginationProps = usePagination({
    items: resultItems,
    itemsPerPage: 8,
  });

  const { currentItems } = paginationProps;

  return (
    <>
      <div className="sites-page bg-background-secondary py-card_pad">
        <div className="flex items-center justify-between gap-20 px-card_pad pb-card_pad">
          <h1>Sites</h1>
          <div className="search-section">
            <input
              type="text"
              placeholder="Start typing to search"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-medium bg-gray px-4 py-2 outline-none focus:outline-none focus-visible:outline-none"
            />
          </div>
        </div>
        <div>
          {sites && resultItems ? (
            currentItems.map((site, index) => (
              <SitesListItemDetail
                key={site.id + index.toString()}
                site={site}
              />
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
