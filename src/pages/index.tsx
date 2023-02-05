import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NetlifySite } from "../types";
import { api } from "../utils/api";
import SitesCard from "../components/SitesCard";

const Home: NextPage = () => {
  const [sitesData, setSitesData] = useState<NetlifySite[]>([]);

  const { data } = api.site.getAll.useQuery();

  useEffect(() => {
    if (data) {
      const siteData = data.map((datum) => [...datum.sites]).flat();
      setSitesData(siteData);
    }
  }, [data]);

  return (
    <div className="landing-page">
      <Layout>
        <SitesCard sites={sitesData} />
      </Layout>
    </div>
  );
};

export default Home;
