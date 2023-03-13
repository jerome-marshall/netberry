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
import { CgSearch } from "react-icons/cg";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  const [fuse, setFuse] = useState<Fuse<SiteWithAccount> | null>(null);
  const [searchText, setSearchText] = useState("");
  const [resultItems, setResultItems] = useState<SiteWithAccount[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (!sites || resultItems) return;

    setResultItems(sites);
    console.log("🚀 ~ file: index.tsx:34 ~ useEffect");

    const fuse = new Fuse(sites, {
      keys: ["name", "url"],
      ignoreLocation: true,
      threshold: 0.4,
      includeScore: true,
    });

    setFuse(fuse);
  }, [sites, resultItems]);

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
  console.log("🚀 ~ file: index.tsx:54 ~ currentItems:", resultItems);

  return (
    <>
      <div className="sites-page bg-background-secondary py-card_pad">
        <div className="flex items-center justify-between gap-20 px-card_pad pb-card_pad">
          <h1>Sites</h1>
          {sites && (
            <div className="search-section flex items-center gap-4 rounded-medium bg-gray px-4 py-2">
              <CgSearch className="h-5 w-5" />
              <input
                type="text"
                placeholder="Start typing to search"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className=" bg-gray  outline-none focus:outline-none focus-visible:outline-none"
              />
            </div>
          )}
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
