import type { FC } from "react";
import { useState } from "react";
import { HiOutlineKey } from "react-icons/hi";
import Modal from "./Modal";

type Props = {
  envs: Record<string, string>;
};
const EnvModal: FC<Props> = ({ envs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const EnvContent = () => {
    return (
      <div>
        {Object.entries(envs).map(([key, value]) => (
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
