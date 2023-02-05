import { type NextPage } from "next";
import { api } from "../utils/api";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  const { data: deployData } = api.site.getAll.useQuery();
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
