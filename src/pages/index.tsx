import { type NextPage } from "next";
import AccountsCard from "../components/AccountsCard";
import SitesCard from "../components/SitesCard";
import { getServerSidePropsHelper } from "../server/serverUtils";

const Home: NextPage = () => {
  return (
    <div className="landing-page">
      <div className="grid grid-cols-12 gap-6 ">
        <SitesCard />
        <AccountsCard />
      </div>
    </div>
  );
};

// export const getServerSideProps = getServerSidePropsHelper;

export default Home;
