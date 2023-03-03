/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import useSites from "../../hooks/useSites";
import Link from "next/link";
import SitesListItemDetail from "../../components/SitesListItemDetail";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  if (!sites) {
    return <div>loading...</div>;
  }

  return (
    <div className="sites-page bg-background-secondary py-card_pad">
      <div className="px-card_pad pb-card_pad">
        <h1>Sites</h1>
        <div className="search-section"></div>
      </div>
      <div>
        {sites.map((site) => (
          <SitesListItemDetail key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
};

export default SitesPage;
