import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NetlifySite } from "../types";
import { api } from "../utils/api";
import SitesCard from "../components/SitesCard";
import DeploysCard from "../components/DeploysCard";

const Home: NextPage = () => {
  return (
    <div className="landing-page">
      <SitesCard />
    </div>
  );
};

export default Home;
