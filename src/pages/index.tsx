import { type NextPage } from "next";
import { api } from "../utils/api";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  const { data } = api.site.getAll.useQuery();
  const { data: deployData } = api.deploy.getAll.useQuery({
    site_id: "2bd5802f-0bf8-4011-b843-e4871da09e49",
  });
  console.log("🚀 ~ file: index.tsx:6 ~ data", deployData);
  return (
    <div className="landing-page">
      <Layout>
        <h1>Sites</h1>
      </Layout>
    </div>
  );
};

export default Home;
