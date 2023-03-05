import { useRouter } from "next/router";
import DeploysCard from "../../components/DeploysCard";
import SiteInfoCard from "../../components/SiteInfoCard";
import { api } from "../../utils/api";

const SiteDetailPage = () => {
  const router = useRouter();
  const query = router.query;
  const site_id = query.site_id as string;
  const account_slug = query.account_slug as string;

  const { data, error } = api.sites.getByAccount.useQuery({
    account_slug,
    site_id,
  });

  const site = data?.site;

  return (
    <div>
      <SiteInfoCard siteInfo={site} />
      <DeploysCard siteInfo={site} />
    </div>
  );
};

export default SiteDetailPage;
