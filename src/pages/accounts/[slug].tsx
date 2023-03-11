import { useRouter } from "next/router";
import type { FC } from "react";
import AccountInfoCard, {
  LoadingAccountInfoCard,
} from "../../components/AccountInfoCard";
import Card from "../../components/Card";
import SitesListItemDetail from "../../components/SitesListItemDetail";
import { api } from "../../utils/api";
import { SitesListItemDetailLoader } from "../../components/SitesListItemDetail";

const AccountsDetailPage: FC = () => {
  const router = useRouter();
  const query = router.query;
  const account_slug = query.slug as string;

  const { data, error, isLoading } = api.accounts.getSites.useQuery({
    account_slug,
  });

  const account = data?.account;
  const sites = data?.sites;

  return (
    <div>
      {account && sites ? (
        <AccountInfoCard account={account} sitesCount={sites.length} />
      ) : (
        <LoadingAccountInfoCard />
      )}
      <Card title="Sites" className="mt-6">
        {sites ? (
          sites.map((site) => (
            <SitesListItemDetail site={{ ...site }} key={site.id} />
          ))
        ) : (
          <SitesListItemDetailLoader />
        )}
      </Card>
    </div>
  );
};

export default AccountsDetailPage;
