import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { NetlifySite } from "./../types.d";

const useSites = () => {
  const [sites, setSites] = useState<NetlifySite[]>([]);

  const { data, error, isLoading } = api.site.getAll.useQuery();

  useEffect(() => {
    if (data) {
      const siteData = data
        .map((datum) => {
          const account = datum.account;
          const sites = datum.sites;
          const sitesWithAccounts = sites.map((site) => ({
            ...site,
            account: { ...account },
          }));
          return sitesWithAccounts;
        })
        .flat();
      setSites(siteData);
    }
  }, [data]);

  return { sites, error, isLoading};
};

export default useSites;
