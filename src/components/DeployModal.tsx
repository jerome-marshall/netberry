import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { HiOutlineKey } from "react-icons/hi";

type Props = {
  envs: Record<string, string>;
};
const DeployModal: FC<Props> = ({ envs }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="button flex items-center gap-2">
          <HiOutlineKey className="h-4 w-4" />
          <span>Deploy</span>
        </DialogTrigger>
        <DialogContent className="w-auto min-w-[500px] !max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Environment Variables</DialogTitle>
            <DialogDescription>
              <div className="mt-1 flex gap-10 border-t border-background-active_hover">
                <div className="env-section max-w-[340px]">
                  {Object.keys(envs).map((key) => (
                    <p className="variable" key={key + "-key"}>
                      {key}
                    </p>
                  ))}
                </div>
                <div className="env-section">
                  {Object.values(envs).map((value) => (
                    <p className="value" key={value + "-value"}>
                      {value}
                    </p>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeployModal;
