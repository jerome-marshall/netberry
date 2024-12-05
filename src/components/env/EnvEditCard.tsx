import { cn } from "@/utils/utils";
import type { FC } from "react";
import React, { useRef } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { api } from "../../utils/api";
import { Input } from "../ui/input";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import Tooltip from "../Tooltip";
import Shimmer from "../Shimmer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

interface EnvEditCardProps {
  account_slug?: string;
  site_id?: string;
  site_account_slug?: string;
  netlify_account_id?: string;
}

const EnvRow: FC<{
  envKey: string;
  envValue: string | undefined;
  account_slug?: string;
  site_id?: string;
  site_account_slug?: string;
  netlify_account_id?: string;
}> = ({
  envKey: key,
  envValue: value,
  account_slug,
  site_account_slug,
  site_id,
  netlify_account_id,
}) => {
  const [editingMode, setEditingMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toastId = useRef<Id | null>(null);

  const utils = api.useContext();

  const [envKey, setEnvKey] = React.useState(key);
  const [envValue, setEnvValue] = React.useState(value);

  const { mutate: deleteEnv } = api.sites.deleteEnv.useMutation({
    onMutate() {
      toastId.current = toast.loading(`Deleting Env - ${key}...`);
      setIsLoading(true);
    },
    onSuccess() {
      utils.sites.getEnvs
        .invalidate({
          account_slug,
          site_id,
        })
        .then(() => {
          toastId.current &&
            toast.update(toastId.current, {
              render: `Env - ${key} deleted successfully!`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          setEditingMode(false);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.error(`🚀 ~ Delete Env - ${key}:`, e);
        });
    },
    onError() {
      setIsLoading(false);
      toastId.current &&
        toast.update(toastId.current, {
          render: "Failed to delete env.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
    },
  });

  const { mutate: saveEnv } = api.sites.updateEnv.useMutation({
    onMutate() {
      toastId.current = toast.loading("Updating env...");
      setIsLoading(true);
    },
    onSuccess() {
      utils.sites.getEnvs
        .invalidate({
          site_account_slug,
          site_id,
        })
        .then(() => {
          toastId.current &&
            toast.update(toastId.current, {
              render: "Env updated successfully",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          setEditingMode(false);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.error("🚀 ~ update Env:", e);
        });
    },
    onError() {
      setIsLoading(false);
      toastId.current &&
        toast.update(toastId.current, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
    },
  });

  const onCancel = () => {
    setEditingMode(false);
    setEnvKey(key);
    setEnvValue(value);
  };

  const onSave = () => {
    saveEnv({
      site_id,
      account_slug,
      site_account_slug,
      env: {
        newKey: envKey,
        key: key,
        value: envValue,
      },
    });
  };

  const onDelete = () => {
    deleteEnv({
      site_id,
      account_slug,
      netlify_account_id,
      key,
    });
  };

  return (
    <>
      {editingMode ? (
        <div
          className={cn(
            "env-grid-row py-4",
            isLoading && "pointer-events-none opacity-50"
          )}
        >
          <Input
            placeholder="Key"
            value={envKey}
            onChange={(e) => setEnvKey(e.target.value)}
          />
          <div>
            <Input
              className="ml-3"
              placeholder="Value"
              value={envValue}
              onChange={(e) => setEnvValue(e.target.value)}
            />
            <div className="action-section mt-3 flex justify-end gap-3">
              <button className="button" onClick={onCancel}>
                Cancel
              </button>
              <button
                className={cn("button button-teal", isLoading && "loading")}
                onClick={onSave}
                disabled={
                  (envKey === key && envValue === value) || !envKey || !envValue
                }
              >
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "env-grid-row hover:bg-background-active_hover",
            isLoading && "animate-pulse"
          )}
        >
          <span className=" break-all text-sm">{key}</span>
          <span className="ml-3 break-all text-sm text-text-muted">
            {value}
          </span>
          {!isLoading && (
            <div className="context-section absolute right-4 flex h-full items-center gap-1.5">
              <Tooltip content="Edit" delay>
                <button
                  className="context-item"
                  onClick={() => setEditingMode(true)}
                >
                  <FaPencilAlt />
                </button>
              </Tooltip>
              <Popover>
                <PopoverTrigger>
                  <Tooltip content="Delete" delay>
                    <div className="context-item">
                      <FaTrash />
                    </div>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-fit">
                  <div className="flex items-center gap-5">
                    <p className=" w-min min-w-[180px] text-sm text-text-muted">
                      Are you sure you want to{" "}
                      <span className="font-semibold text-text-primary">
                        delete {key}?
                      </span>
                    </p>
                    <PopoverClose>
                      <button
                        className="button button-red w-20 "
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const EnvEditCard: FC<EnvEditCardProps> = ({
  account_slug,
  site_id,
  site_account_slug,
  netlify_account_id,
}) => {
  const { data: envData } = api.sites.getEnvs.useQuery(
    {
      site_account_slug,
      site_id: site_id,
      account_slug,
    },
    {
      enabled: !!account_slug && !!site_id && !!site_account_slug,
      retry: 2,
    }
  );

  if (!envData) return <EnvEditCardLoader />;

  return (
    <div className="flex flex-col rounded-medium border border-gray-darkest bg-background-secondary py-card_pad">
      <div className="flex flex-col">
        {Object.entries(envData).map(([key, value]) => (
          <EnvRow
            envKey={key}
            envValue={value}
            key={key}
            account_slug={account_slug}
            site_id={site_id}
            site_account_slug={site_account_slug}
            netlify_account_id={netlify_account_id}
          />
        ))}
      </div>
    </div>
  );
};

export const EnvEditCardLoader = () => {
  return (
    <div className="flex flex-col rounded-medium border border-gray-darkest bg-background-secondary py-card_pad">
      <div className="flex flex-col">
        {[...(new Array(10) as undefined[])].map((_, i) => (
          <div key={i} className="env-grid-row flex animate-pulse gap-4 py-3">
            <Shimmer className="h-3.5 w-[250px]" />
            <Shimmer className="h-3.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvEditCard;
