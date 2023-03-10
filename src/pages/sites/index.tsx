/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import SitesListItemDetail, {
  SitesListItemDetailLoader,
} from "../../components/SitesListItemDetail";
import useSites from "../../hooks/useSites";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  return (
    <div className="sites-page bg-background-secondary py-card_pad">
      <div className="px-card_pad pb-card_pad">
        <h1>Sites</h1>
        <div className="search-section"></div>
      </div>
      <div>
        {sites ? (
          sites.map((site) => <SitesListItemDetail key={site.id} site={site} />)
        ) : (
          <SitesListItemDetailLoader />
        )}
      </div>
    </div>
  );
};

export default SitesPage;
