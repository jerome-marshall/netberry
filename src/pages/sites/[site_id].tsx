import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NetlifySite } from "../../types";
import { api } from "../../utils/api";
import SiteInfoCard from "../../components/SiteInfoCard";
import DeploysCard from "../../components/DeploysCard";

const SiteDetailPage = () => {
  const router = useRouter();
  const query = router.query;
  const site_id = query.site_id as string;

  const { data, error, isLoading } = api.sites.getByID.useQuery({ site_id });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return null;

  return (
    <div>
      <SiteInfoCard siteInfo={data} />
      <DeploysCard site_id={site_id} />
    </div>
  );
};

export default SiteDetailPage;
