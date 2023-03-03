import { useRouter } from "next/router";
import React, { FC } from "react";
import AccountInfoCard from "../../components/AccountInfoCard";
import Card from "../../components/Card";
import SitesListItemDetail from "../../components/SitesListItemDetail";
import { api } from "../../utils/api";
import { SitesLandingURL } from "../../utils/urls";

const AccountsDetailPage: FC = () => {
  const router = useRouter();
  const query = router.query;
  const account_slug = query.slug as string;

  const { data, error, isLoading } = api.accounts.getSites.useQuery({
    account_slug,
  });

  if (!data || isLoading) return <div>Loading...</div>;

  const { account, sites } = data;

  return (
    <div>
      <AccountInfoCard account={account} sitesCount={sites.length} />
      <Card title="Sites" className="mt-6">
        {sites.map((site) => (
          <SitesListItemDetail site={site} key={site.id} />
        ))}
      </Card>
    </div>
  );
};

export default AccountsDetailPage;
