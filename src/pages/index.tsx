import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NetlifySite } from "../types";
import { api } from "../utils/api";
import SitesCard from "../components/SitesCard";
import DeploysCard from "../components/DeploysCard";
import AccountsCard from "../components/AccountsCard";

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
