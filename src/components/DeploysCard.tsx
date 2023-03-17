import clsx from "clsx";
import Link from "next/link";
import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { AiOutlineLink, AiOutlineStop } from "react-icons/ai";
import usePagination from "../hooks/usePagination";
import type { NetlifyDeploy, SiteWithAccount } from "../types";
import { api } from "../utils/api";
import {
  getDeplayStatusText,
  getDeployDuration,
  getDeployMessage,
  getDeployStatus,
  getDeployTime,
  getStatusTheme,
} from "../utils/deployUtils";
import Card from "./Card";
import Modal from "./Modal";
import Pagination from "./Pagination";
import RightArrow from "./RightArrow";
import Shimmer from "./Shimmer";

type Props = {
  siteInfo: SiteWithAccount | undefined;
  setRefetchDeploys:
    | Dispatch<SetStateAction<null>>
    | Dispatch<SetStateAction<() => unknown>>;
};

const DeploysCard: FC<Props> = ({ siteInfo, setRefetchDeploys }) => {
  const [refetchInterval, setRefetchInterval] = useState(0);

  const site_id = siteInfo?.site_id as string;
  const slug = siteInfo?.account?.slug as string;

  const { data, refetch } = api.deploys.getAll.useQuery(
    { site_id, account_slug: slug },
    {
      refetchInterval,
      enabled: !!siteInfo,
    }
  );

  useEffect(() => {
    if (data) {
      const shouldRefetch = data.some(
        (deploy) =>
          deploy.state === "building" ||
          deploy.state === "enqueued" ||
          deploy.state === "uploading" ||
          deploy.state === "processing"
      );

      if (shouldRefetch) {
        setRefetchInterval(5000);
      } else {
        setRefetchInterval(0);
      }
    }
  }, [data]);

  useEffect(() => {
    setRefetchDeploys &&
      setRefetchDeploys(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
        () => refetch as any
      );
  }, [refetch, setRefetchDeploys]);

  const pagination = usePagination({
    items: data,
  });

  if (!siteInfo || !data) return <DeploysCardLoader />;

  const DeployCardItem = ({ deploy }: { deploy: NetlifyDeploy }) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const { mutate, data: cancelData } = api.deploys.cancelDeploy.useMutation();

    useEffect(() => {
      if (cancelData) {
        refetch().finally(() => {
          setRefetchInterval(0);
        });
      }
    }, [cancelData]);

    const { status: deployStatus, theme } = getDeployStatus(deploy);

    const showStatus =
      (siteInfo.published_deploy?.id === deploy.id &&
        deployStatus === "published") ||
      deployStatus !== "published";

    const { id, created_at, published_at, links } = deploy;

    return (
      <div
        className={clsx(
          "card-item group w-full cursor-pointer justify-between gap-6 even:bg-background-active",
          published_at && "card-item-muted"
        )}
        onClick={openModal}
        key={id}
      >
        <div className="flex flex-col">
          <div className="flex gap-2">
            <GitInfo deploy={deploy} className="text-sm" />
            {showStatus && (
              <p className={getStatusTheme(theme)}>{deployStatus}</p>
            )}{" "}
          </div>
          <p className=" text-left text-sm text-text-muted">
            {getDeployMessage(deploy)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end justify-center">
            <p
              className={clsx(
                "text-sm  ",
                published_at
                  ? "font-bold text-white"
                  : "font-normal text-text-muted"
              )}
            >
              {getDeployTime(created_at)}
            </p>
            {published_at && (
              <p className="mt-1 text-xs text-text-muted">
                Deployed in {getDeployDuration(created_at, published_at)}
              </p>
            )}
          </div>
          <RightArrow />
        </div>

        {isOpen && (
          <Modal
            content={
              <div className="p-card_pad pt-2">
                <div className="flex justify-between">
                  <p className="text-2xl">
                    Deploy {getDeplayStatusText(deployStatus)}
                  </p>
                  <p className=" text-text-muted">
                    {getDeployTime(created_at)}
                  </p>
                </div>
                {deployStatus === "published" && (
                  <p className="mt-2 text-base text-text-muted">
                    Deployed in {getDeployDuration(created_at, published_at)}
                  </p>
                )}

                <GitInfo deploy={deploy} className="mt-2 text-text-muted" />
                {deployStatus === "failed" && (
                  <p className="mt-2 text-base text-text-muted">
                    Error message: {getDeployMessage(deploy)}
                  </p>
                )}
                <div className="flex gap-6">
                  {links?.permalink && deployStatus === "published" && (
                    <a
                      href={links?.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="button-teal mt-6 flex w-fit items-center text-base"
                    >
                      <span>Open permalink</span>
                      <AiOutlineLink className="ml-3 !h-5 !w-5" />
                    </a>
                  )}
                  {theme === "gold" && (
                    <button
                      className="button-red mt-6 flex w-fit items-center text-base"
                      onClick={() => {
                        mutate({
                          account_slug: slug,
                          deploy_id: id,
                        });
                      }}
                      disabled={cancelData?.id === id}
                    >
                      <AiOutlineStop className="mr-3 !h-5 !w-5" />
                      <span>Cancel build</span>
                    </button>
                  )}
                </div>
              </div>
            }
            isOpen={isOpen}
            onClose={closeModal}
            title={"Deploy details"}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mt-6">
        <Card title="Production Deploys" titleLink="">
          {pagination.currentItems.map(
            (deploy: NetlifyDeploy, index: number) => (
              <DeployCardItem deploy={deploy} key={index} />
            )
          )}
        </Card>
      </div>
      <Pagination {...pagination} />
    </>
  );
};

export default DeploysCard;

const GitInfo = ({
  deploy,
  className,
}: {
  deploy: NetlifyDeploy;
  className?: string;
}) => {
  const { context, branch, published_at, deploy_url } = deploy;

  return (
    <p className={className}>
      {published_at ? (
        <Link
          href={deploy_url}
          className="font-semibold capitalize underline decoration-text-muted hover:text-white hover:decoration-white hover:decoration-2"
        >
          {context}
        </Link>
      ) : (
        <span className="capitalize">{context}</span>
      )}
      {": "}
      {branch}
      {/* @
      <Link
        href={""}
        className="text-[80%] underline decoration-text-muted hover:text-white hover:decoration-white"
      >
        HEAD
      </Link> */}
    </p>
  );
};

export const DeploysCardLoader = () => {
  return (
    <div className="mt-6">
      <Card title="Production Deploys" titleLink="">
        {Array(7)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                key={"deployitem" + i.toString()}
                className={clsx(
                  "card-item group cursor-pointer justify-between gap-6"
                )}
              >
                <div className="">
                  <div className="flex gap-2">
                    <Shimmer className="h-4 w-[260px]" />
                  </div>
                  <Shimmer className="mt-2 h-3 w-[160px]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end justify-center">
                    <Shimmer className=" h-4 w-[160px]" />
                    <Shimmer className="mt-2 h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            );
          })}
      </Card>
    </div>
  );
};
