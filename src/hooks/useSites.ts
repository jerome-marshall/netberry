import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Site, SiteWithAccount } from "./../types.d";

const useSites = () => {
  const [sites, setSites] = useState<SiteWithAccount[] | undefined>();

  const { data, error, isLoading } = api.sites.getAll.useQuery();

  useEffect(() => {
    if (data) {
      const siteData = data.map((datum) => datum.sites).flat();
      setSites(siteData);
    }
  }, [data]);

  return { sites, error, isLoading };
};

export default useSites;
