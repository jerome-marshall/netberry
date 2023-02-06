/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import useSites from "../../hooks/useSites";
import Link from "next/link";

const SitesPage: NextPage = () => {
  const { sites } = useSites();

  return (
    <div className="sites-page bg-background-secondary py-card_pad">
      <div className="px-card_pad">
        <h1>Sites</h1>
        <div className="search-section"></div>
      </div>
      <div>
        {sites.map((site) => (
          <Link
            href={`/sites/${site.id}`}
            key={site.id + site.name}
            className="card-item cursor-pointer gap-6"
          >
            <img
              src={site.screenshot_url}
              alt=""
              className="max-h-16 rounded-medium"
            />
            <div className="flex flex-col justify-center">
              <p className="text-base font-semibold text-white">{site.name}</p>
              <Link
                href={site.url}
                className="text-sm text-text-muted hover:underline "
              >
                {site.url}
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SitesPage;
