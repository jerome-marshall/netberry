import { useRouter } from "next/router";
import type { FC } from "react";
import AccountInfoCard, {
  LoadingAccountInfoCard,
} from "../../components/AccountInfoCard";
import Card from "../../components/Card";
import SitesListItemDetail from "../../components/SitesListItemDetail";
import { api } from "../../utils/api";
import { SitesListItemDetailLoader } from "../../components/SitesListItemDetail";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import { getServerSidePropsHelper } from "../../server/serverUtils";

const AccountsDetailPage: FC = () => {
  const router = useRouter();
  const query = router.query;
  const account_slug = query.slug as string;

  const { data, refetch, isRefetching } = api.accounts.getSites.useQuery({
    account_slug,
  });

  const account = data?.account;
  const sites = data?.sites;

  const pagination = usePagination({
    items: sites,
    itemsPerPage: 8,
  });

  return (
    <>
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

export default AccountsDetailPage;

// export const getServerSideProps = getServerSidePropsHelper;
