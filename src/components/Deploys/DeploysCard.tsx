import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import type { NetlifyDeploy, SiteWithAccount } from "../../types";
import { api } from "../../utils/api";
import Callout from "../Callout";
import Card from "../Card";
import Pagination from "../Pagination";
import DeployCardItem from "./DeployCardItem";
import DeploysCardLoader from "./DeploysCardLoader";

type Props = {
  siteInfo: SiteWithAccount | undefined;
  setRefetchDeploys:
    | Dispatch<SetStateAction<null>>
    | Dispatch<SetStateAction<() => unknown>>;
  refetchSite: (() => Promise<unknown> | undefined) | null;
};

const DeploysCard: FC<Props> = ({
  siteInfo,
  setRefetchDeploys,
  refetchSite,
}) => {
  const [deploysRefetchInterval, setDelploysRefetchInterval] = useState(0);

  const site_id = siteInfo?.site_id as string;
  const slug = siteInfo?.account?.slug as string;

  const {
    data,
    refetch: refetchDeploys,
    isFetching: isFetchingDeploys,
  } = api.deploys.getAll.useQuery(
    { site_id, account_slug: slug },
    {
      refetchInterval: deploysRefetchInterval,
      enabled: !!siteInfo,
      retry: 2,
    }
  );

  useEffect(() => {
    if (data) {
      const shouldRefetch = data.some(
        (deploy) =>
          deploy.state === "new" ||
          deploy.state === "waiting" ||
          deploy.state === "building" ||
          deploy.state === "enqueued" ||
          deploy.state === "uploading" ||
          deploy.state === "preparing" ||
          deploy.state === "processing" ||
          deploy.state === "publishing" ||
          deploy.state === "build ready" ||
          deploy.state === "unknown"
      );

      if (shouldRefetch) {
        setDelploysRefetchInterval(5000);
      } else {
        setDelploysRefetchInterval(0);
        refetchSite && refetchSite()?.finally(() => null);
      }
    }
  }, [data, refetchSite]);

  useEffect(() => {
    setRefetchDeploys &&
      setRefetchDeploys(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
        () => refetchDeploys as any
      );
  }, [refetchDeploys, setRefetchDeploys]);

  const pagination = usePagination({
    items: data,
  });

  if (!siteInfo || !data) return <DeploysCardLoader />;

  return (
    <>
      <Callout
        variant="warning"
        text="The published deploy for this site has been locked and auto-publishing has been stopped. Any new deploys will still be built, but won't be automatically published until the current published deploy is unlocked."
        showCallout={!!siteInfo.published_deploy?.locked}
      />

      <div className="mt-6" key={"deploy-card"}>
        <Card title="Production Deploys" titleLink="">
          {pagination.currentItems.map(
            (deploy: NetlifyDeploy, index: number) => (
              <DeployCardItem
                deploy={deploy}
                key={index}
                isFetchingDeploys={isFetchingDeploys}
                refetchDeploys={refetchDeploys}
                refetchSite={refetchSite}
                siteInfo={siteInfo}
                setDelploysRefetchInterval={setDelploysRefetchInterval}
              />
            )
          )}
        </Card>
      </div>
      <Pagination {...pagination} />
    </>
  );
};

export default DeploysCard;
