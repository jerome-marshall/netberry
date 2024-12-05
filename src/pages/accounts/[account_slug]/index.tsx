import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { sortSites } from "../../../common/utils";
import AccountInfoCard, {
  LoadingAccountInfoCard,
} from "../../../components/AccountInfoCard";
import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import Pagination from "../../../components/Pagination";
import SitesListItemDetail, {
  SitesListItemDetailLoader,
} from "../../../components/SitesListItemDetail";
import TRPCErrorComponent from "../../../components/TRPCErrorComponent";
import usePagination from "../../../hooks/usePagination";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

const AccountsDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query;
  const account_slug = query.account_slug as string;

  const { data, refetch, isRefetching, error } = api.accounts.getSites.useQuery(
    {
      account_slug,
    },
    {
      enabled: !!account_slug,
      retry: 2,
    }
  );

  const account = data?.account;
  const sites = data?.sites;

  sites?.sort(sortSites);

  const pagination = usePagination({
    items: sites,
    itemsPerPage: 8,
  });

  if (error) {
    return <TRPCErrorComponent error={error} />;
  }

  return (
    <>
      <NextSeo title={account?.name} />
      <div>
        {account && sites ? (
          <AccountInfoCard
            account={account}
            sitesCount={sites.length}
            refetch={refetch}
            isFetching={isRefetching}
          />
        ) : (
          <LoadingAccountInfoCard />
        )}
        <Card title="Sites" className="mt-6">
          {sites ? (
            pagination.currentItems.map((site) => (
              <SitesListItemDetail site={{ ...site }} key={site.id} />
            ))
          ) : (
            <SitesListItemDetailLoader />
          )}
        </Card>
      </div>
      <Pagination {...pagination} />
    </>
  );
};

AccountsDetailPage.getLayout = (page) => <Layout>{page}</Layout>;

export default AccountsDetailPage;
