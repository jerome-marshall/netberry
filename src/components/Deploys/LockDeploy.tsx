import clsx from "clsx";
import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { FaLock, FaUnlock, FaLockOpen } from "react-icons/fa";
import Modal from "../Modal";
import { api } from "../../utils/api";
import { SiteWithAccount } from "../../types";

interface LockDeployProps {
  locked: boolean;
  deployStatus: string;
  isFetchingDeploys: boolean;
  accountSlug: string;
  deployID: string;
  refetchDeploys: () => Promise<unknown>;
  refetchSite: (() => Promise<unknown> | undefined) | null;
  closeMainModal: () => void;
  site: SiteWithAccount;
}

const LockDeploy: FC<LockDeployProps> = ({
  locked,
  deployStatus,
  isFetchingDeploys,
  accountSlug,
  deployID,
  refetchDeploys,
  refetchSite,
  closeMainModal,
  site,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  const {
    mutate: lockDeploy,
    isLoading: lockingDeploy,
    isSuccess: lockSuccessful,
  } = api.deploys.lockDeploy.useMutation();

  const {
    mutate: unlockDeploy,
    isLoading: unlockingDeploy,
    isSuccess: unlockSuccessful,
  } = api.deploys.unlockDeploy.useMutation();

  useEffect(() => {
    if (lockSuccessful || unlockSuccessful) {
      refetchDeploys().finally(() => {
        closeModal();
        closeMainModal();
      });
      refetchSite && refetchSite()?.finally(() => null);
    }
  }, [
    lockSuccessful,
    unlockSuccessful,
    refetchDeploys,
    refetchSite,
    closeModal,
    closeMainModal,
  ]);

  if (!(deployStatus === "published")) return null;
  return (
    <>
      <button
        className={clsx(
          "button mt-6 flex w-fit items-center px-4 py-2 text-sm",
          isFetchingDeploys && "loading"
        )}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {locked ? (
          <FaLockOpen className="mr-3 !h-3.5 !w-3.5" />
        ) : (
          <FaLock className="mr-3 !h-3.5 !w-3.5" />
        )}
        <span>{locked ? "Unlock deploy" : "Lock deploy"}</span>
      </button>

      {isOpen && (
        <Modal
          key={deployID.toString() + "modal"}
          title={
            locked
              ? "Unlock to start auto publishing"
              : "Lock to stop auto publishing"
          }
          content={
            <div className="lock-confirmation max-w-lg px-card_pad py-2">
              <p className="text-sm text-text-muted">
                {locked
                  ? "If you unlock the published deploy, then auto publishing will resume. Deploys that are configured to publish on your site will automatically publish."
                  : "If you lock the published deploy, then auto publishing will stop. New deploys for the site will still build but not publish until you unlock the published deploy."}
              </p>
              <div className="mt-6 flex">
                <button
                  className={clsx(
                    "button-teal flex w-fit items-center px-4 py-2 text-sm",
                    (lockingDeploy || unlockingDeploy || isFetchingDeploys) &&
                      "loading"
                  )}
                  onClick={() => {
                    if (locked)
                      unlockDeploy({
                        account_slug: accountSlug,
                        deploy_id: deployID,
                        site_id: site.site_id,
                        site_name: site.name,
                      });
                    else
                      lockDeploy({
                        account_slug: accountSlug,
                        deploy_id: deployID,
                        site_id: site.site_id,
                        site_name: site.name,
                      });
                  }}
                >
                  <span>
                    {locked
                      ? "Unlock published deploy"
                      : "Lock published deploy"}
                  </span>
                </button>
                <button
                  className="button ml-4 flex w-fit items-center px-4 py-2 text-sm"
                  onClick={closeModal}
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          }
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default LockDeploy;
