import { useRouter } from "next/router";
import React from "react";
import DeploysCard from "../../components/DeploysCard";
import SiteInfoCard from "../../components/SiteInfoCard";
import { api } from "../../utils/api";

const SiteDetailPage = () => {
  const router = useRouter();
  const query = router.query;
  const site_id = query.site_id as string;
  const account_slug = query.account_slug as string;

  const { data, error, isLoading } = api.sites.getByAccount.useQuery({
    account_slug,
    site_id,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return null;

  const { site } = data;

  return (
    <div>
      <SiteInfoCard siteInfo={site} />
      <DeploysCard site_id={site_id} />
    </div>
  );
};

export default SiteDetailPage;
