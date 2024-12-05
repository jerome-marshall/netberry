import FavouriteSitesCard from "../components/FavouriteSitesCard";
import Layout from "../components/Layout";
import SitesCard from "../components/SitesCard";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <div className="landing-page">
      <div className="grid grid-cols-12 gap-6 ">
        <SitesCard />
        {/* <AccountsCard /> */}
        <FavouriteSitesCard />
      </div>
    </div>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
