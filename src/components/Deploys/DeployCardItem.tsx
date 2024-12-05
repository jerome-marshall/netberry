import clsx from "clsx";
import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { AiOutlineStop } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import type { NetlifyDeploy, SiteWithAccount } from "../../types";
import { api } from "../../utils/api";
import {
  getDeplayStatusText,
  getDeployDuration,
  getDeployMessage,
  getDeployStatus,
  getDeployTime,
  getStatusTheme,
} from "../../utils/deployUtils";
import Modal from "../Modal";
import RightArrow from "../RightArrow";
import GitInfo from "./GitInfo";
import LightHouseReport from "./LightHouseReport";
import LockDeploy from "./LockDeploy";

interface DeployCardItemProps {
  deploy: NetlifyDeploy;
  setDelploysRefetchInterval: Dispatch<SetStateAction<number>>;
  refetchDeploys: () => Promise<unknown>;
  refetchSite: (() => Promise<unknown> | undefined) | null;
  siteInfo: SiteWithAccount | undefined;
  isFetchingDeploys: boolean;
}

const DeployCardItem: FC<DeployCardItemProps> = ({
  deploy,
  setDelploysRefetchInterval,
  refetchDeploys,
  refetchSite,
  siteInfo,
  isFetchingDeploys,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const {
    mutate: cancelDeploy,
    data: cancelData,
    isLoading: isCancelling,
  } = api.deploys.cancelDeploy.useMutation({
    onSuccess: () => {
      refetchDeploys().finally(() => null);
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (cancelData) {
      setDelploysRefetchInterval(0);
    }
  }, [cancelData, setDelploysRefetchInterval]);

  const { status: deployStatus, theme } = getDeployStatus(deploy);

  deployStatus === "unknown" && console.log("🚀 ~ deploy:", deploy);

  if (!siteInfo) return null;

  const slug = siteInfo?.account?.slug;

  const showStatus =
    (siteInfo.published_deploy?.id === deploy.id &&
      deployStatus === "published") ||
    deployStatus !== "published";

  const { id, created_at, published_at, links, locked, deploy_time } = deploy;

  const muteCard = deployStatus === "skipped" || deployStatus === "rejected";

  const isBuilding =
    deployStatus === "building" ||
    deployStatus === "processing" ||
    deployStatus === "build ready" ||
    deployStatus === "publishing";

  return (
    <div
      className={clsx(
        "card-item group w-full cursor-pointer justify-between gap-6",
        muteCard &&
          "cursor-default !bg-background-secondary opacity-50 even:!bg-background-active"
      )}
      onClick={muteCard ? () => null : openModal}
      key={id}
    >
      <div className="flex flex-col">
        <div className="flex gap-2">
          <GitInfo deploy={deploy} className="text-sm" siteInfo={siteInfo} />
          {showStatus && (
            <p
              className={clsx(
                "flex h-fit items-center",
                getStatusTheme(theme),
                isBuilding && "animate-pulse"
              )}
            >
              {locked && <FaLock className="mr-1" />}
              {deployStatus}
            </p>
          )}{" "}
        </div>
        <p className=" text-left text-sm text-text-muted">
          {getDeployMessage(deploy)}
        </p>
      </div>
      <div className="flex">
        <LightHouseReport deploy={deploy} />
        <div className="flex min-w-[200px] items-center justify-end gap-4 pl-3">
          <div className="flex flex-col items-end justify-center">
            <p
              className={clsx(
                "text-sm",
                published_at
                  ? "font-bold text-white"
                  : "font-normal text-text-muted"
              )}
            >
              {getDeployTime(created_at)}
            </p>
            {deploy_time && (
              <p className="mt-1 text-xs text-text-muted">
                Deployed in {getDeployDuration(deploy_time)}
              </p>
            )}
          </div>
          <RightArrow />
        </div>
      </div>

      {isOpen && (
        <Modal
          key={id.toString() + "modal"}
          content={
            <div className="px-card_pad pt-2">
              <div className="flex justify-between">
                <p className="text-xl font-semibold leading-6">
                  Deploy {getDeplayStatusText(deployStatus)}
                </p>
                <p className=" text-sm text-text-muted">
                  {getDeployTime(created_at)}
                </p>
              </div>
              {deploy_time && (
                <p className="mt-2 text-sm text-text-muted">
                  Deployed in {getDeployDuration(deploy_time)}
                </p>
              )}

              <GitInfo
                deploy={deploy}
                className="mt-2 text-sm text-text-muted"
                siteInfo={siteInfo}
              />
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
                    className="button-teal mt-6 flex w-fit items-center px-4 py-2 text-sm"
                  >
                    <FiExternalLink className="!h-4.5 !w-4.5 mr-3" />
                    <span>Open permalink</span>
                  </a>
                )}
                {theme === "gold" && (
                  <button
                    className={clsx(
                      "button-red mt-6 flex w-fit items-center px-4 py-2 text-sm ",
                      isCancelling && "loading"
                    )}
                    onClick={() => {
                      cancelDeploy({
                        account_slug: slug,
                        deploy_id: id,
                        site_id: siteInfo.site_id,
                        site_name: siteInfo.name,
                      });
                    }}
                  >
                    <AiOutlineStop className="mr-3 !h-4 !w-4" />
                    <span>Cancel build</span>
                  </button>
                )}
                <LockDeploy
                  locked={!!locked}
                  deployStatus={deployStatus}
                  isFetchingDeploys={isFetchingDeploys}
                  accountSlug={slug}
                  deployID={id}
                  refetchDeploys={refetchDeploys}
                  refetchSite={refetchSite}
                  closeMainModal={closeModal}
                  site={siteInfo}
                />
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

export default DeployCardItem;
