import clsx from "clsx";
import _ from "lodash";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiOutlineKey } from "react-icons/hi";
import { MdFileDownload } from "react-icons/md";
import type { SiteWithAccount } from "../types";
import { api } from "../utils/api";
import Modal from "./Modal";
import { CopyButton, CopyButtonSm } from "./ui/copy-button";
import { IoSettingsSharp } from "react-icons/io5";
import { getSiteSettingsEnvURL } from "@/utils/urls";
import Link from "next/link";

type Props = {
  envs: Record<string, string | undefined> | undefined;
  site: SiteWithAccount;
};

const EnvModal: FC<Props> = ({ envs, site }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [showEnv, setShowEnv] = useState(true);

  const [downloadLink, setDownloadLink] = useState<string | undefined>();

  const [envsObj, setEnvsObj] = useState<
    Record<string, string | undefined> | undefined
  >(envs);

  const [copyValue, setCopyValue] = useState<string>("");

  const { data, isLoading, isError } = api.sites.getEnvs.useQuery(
    {
      site_account_slug: site.account_slug,
      site_id: site.id,
      account_slug: site.account.slug,
    },
    {
      enabled: !!site.account_slug && !!site.id && !!site.account.slug,
      retry: 2,
    }
  );

  useEffect(() => {
    if (data) {
      setEnvsObj(data);

      const envStr = Object.entries(data)
        .map(([key, value]) => `${key}=${value || ""}`)
        .join("\n");
      setCopyValue(envStr);
    }

    if (isError) {
      setShowEnv(false);
    }
  }, [data, isError]);

  envsObj &&
    Object.keys(envsObj).forEach((key) => {
      if (envsObj[key] === undefined || envsObj[key] === null) {
        delete envsObj[key];
      }
    });

  const { data: envData } = api.sites.getEnvFile.useQuery(
    {
      site_name: site.name,
      envs: envsObj as Record<string, string>,
    },
    {
      enabled: !!site.name && !!envsObj,
    }
  );

  const { mutate: logDownload } = api.sites.downloadEnv.useMutation();
  const { mutate: logOpen } = api.sites.openEnv.useMutation();

  useEffect(() => {
    if (isOpen) {
      logOpen({
        account_slug: site.account.slug,
        account_name: site.account.name,
        account_id: site.account.id,
        site_id: site.id,
        site_name: site.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (envData) {
      const blob = new Blob([Buffer.from(envData, "base64")], {
        type: "text/plain",
      });

      setDownloadLink(window.URL.createObjectURL(blob));
    }
  }, [envData]);

  const EnvContent = () => {
    if (_.isEmpty(envsObj)) return null;

    return (
      <div className="-mb-4 flex flex-col">
        {Object.entries(envsObj).map(([key, value]) => (
          <div
            key={key}
            className={
              "grid grid-cols-[250px_minmax(0,_1fr)] px-card_pad py-2 even:bg-background-active "
            }
          >
            <span className=" mr-3 break-all text-sm">{key}</span>
            <span className="break-all text-sm text-text-muted">{value}</span>
          </div>
        ))}
        <div className="sticky bottom-4 right-0 z-10 mr-6 mt-8 ml-auto flex gap-4">
          <Link
            href={getSiteSettingsEnvURL(site.account.slug, site.id)}
            className="button"
          >
            <IoSettingsSharp className="mr-2 h-4 w-4" />
            <span>Env Settings</span>
          </Link>
          {!!downloadLink && (
            <a
              href={downloadLink}
              download={`${site.name}.env`}
              className="button hover:ring-1 hover:ring-gray-light "
              onClick={() => {
                logDownload({
                  account_slug: site.account.slug,
                  account_name: site.account.name,
                  account_id: site.account.id,
                  site_id: site.id,
                  site_name: site.name,
                });
              }}
            >
              <MdFileDownload className="mr-2 h-4 w-4" /> <span>Download</span>
            </a>
          )}
          {!!copyValue && (
            <CopyButton value={copyValue} className="button button-teal" />
          )}
        </div>
      </div>
    );
  };

  if (!showEnv) return null;

  return (
    <div>
      <button
        className={clsx("button", isLoading && "loading")}
        onClick={openModal}
      >
        <HiOutlineKey className="mr-2" />
        <span>Env Variables</span>
      </button>
      <Modal
        content={<EnvContent />}
        isOpen={isOpen}
        onClose={closeModal}
        title={"Environment Variables"}
      />
    </div>
  );
};

export default EnvModal;
