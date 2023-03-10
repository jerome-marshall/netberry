import { type NextPage } from "next";
import AccountsCard from "../components/AccountsCard";
import SitesCard from "../components/SitesCard";

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

export default Home;
