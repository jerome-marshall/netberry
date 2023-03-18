import _ from "lodash";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiOutlineKey } from "react-icons/hi";
import type { SiteWithAccount } from "../types";
import { api } from "../utils/api";
import Modal from "./Modal";

type Props = {
  envs: Record<string, string | undefined> | undefined;
  site: SiteWithAccount;
};

const EnvModal: FC<Props> = ({ envs, site }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [envsObj, setEnvsObj] = useState<
    Record<string, string | undefined> | undefined
  >(envs);

  const { data } = api.sites.getEnv.useQuery({
    site_account_slug: site.account_slug,
    site_id: site.id,
    account_slug: site.account.slug,
  });

  useEffect(() => {
    if (data) {
      setEnvsObj(data);
    }
  }, [data]);

  if (!envsObj || _.isEmpty(envsObj)) return null;

  const EnvContent = () => {
    return (
      <div>
        {Object.entries(envsObj).map(([key, value]) => (
          <div
            key={key}
            className={
              "grid grid-cols-[250px_minmax(0,_1fr)] px-card_pad py-2 even:bg-background-active"
            }
          >
            <span className=" break-all text-sm ">{key}</span>
            <span className="break-all text-sm text-text-muted">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <button className="button" onClick={openModal}>
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
