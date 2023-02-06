import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NetlifySite } from "../../types";
import { api } from "../../utils/api";
import SiteInfoCard from "../../components/SiteInfoCard";

const SiteDetailPage = () => {
  const router = useRouter();
  const query = router.query;
  const site_id = query.site_id as string;

  const { data, error, isLoading } = api.site.getByID.useQuery({ site_id });
  console.log("🚀 ~ file: [site_id].tsx:13 ~ SiteDetailPage ~ data", data);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return null;

  return (
    <div>
      <SiteInfoCard siteInfo={data} />
    </div>
  );
};

export default SiteDetailPage;
