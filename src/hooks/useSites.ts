import { useEffect, useState } from "react";
import { sortSites } from "../common/utils";
import { api } from "../utils/api";
import type { SiteWithAccount } from "./../types.d";

const useSites = () => {
  const [sites, setSites] = useState<SiteWithAccount[] | undefined>();
  const [timestamp, setTimestamp] = useState<number | undefined>();

  const { data, error, isLoading } = api.sites.getAll.useQuery(undefined, {
    retry: 2,
    initialData: sites,
    initialDataUpdatedAt: timestamp,
  });

  useEffect(() => {
    if (data) {
      const siteData = data.map((datum) => datum.sites).flat();
      siteData.sort(sortSites);
      setSites(siteData);

      // set sites in local storage with timestamp
      localStorage.setItem(
        "sites",
        JSON.stringify({
          sites: siteData,
          timestamp: Date.now(),
        })
      );
    } else {
      // get sites from local storage
      const localSitesData = localStorage.getItem("sites");
      if (localSitesData) {
        const { sites: localSites, timestamp } = JSON.parse(localSitesData) as {
          sites: SiteWithAccount[];
          timestamp: number;
        };
        setSites(localSites);
        setTimestamp(timestamp);
      }
    }
  }, [data]);

  return { sites, error, isLoading };
};

export default useSites;
