import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import DeploysCard from "../../../../components/Deploys/DeploysCard";
import SiteInfoCard from "../../../../components/SiteInfoCard";
import TRPCErrorComponent from "../../../../components/TRPCErrorComponent";
import { api } from "../../../../utils/api";
import type { NextPageWithLayout } from "../../../_app";
import Layout from "../../../../components/Layout";

const SiteDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query;
  const site_id = query.site_id as string;
  const account_slug = query.account_slug as string;

  const { data, error, refetch } = api.sites.getByAccount.useQuery(
    {
      account_slug,
      site_id,
    },
    {
      retry: 2,
      enabled: !!site_id && !!account_slug,
    }
  );

  const site = data?.site;

  const [refetchDeploys, setRefetchDeploys] = useState(() => null);

  if (error) {
    return <TRPCErrorComponent error={error} />;
  }

  return (
    <div>
      <NextSeo title={site?.name} />
      <SiteInfoCard siteInfo={site} refetchDeploys={refetchDeploys} />
      <DeploysCard
        siteInfo={site}
        setRefetchDeploys={setRefetchDeploys}
        refetchSite={refetch}
      />
    </div>
  );
};

SiteDetailPage.getLayout = (page) => <Layout>{page}</Layout>;

export default SiteDetailPage;
