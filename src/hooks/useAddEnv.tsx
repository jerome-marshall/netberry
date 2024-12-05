import { api } from "@/utils/api";
import React from "react";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";

export default function useAddEnv({
  cbOnSuccess,
  cbOnError,
  cbOnMutate,
  cbOnSettled,
}: {
  cbOnMutate?: () => void;
  cbOnSuccess?: () => void;
  cbOnError?: () => void;
  cbOnSettled?: () => void;
} = {}) {
  const toastIdEnv = React.useRef<Id | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const addEnvMutation = api.sites.addEnv.useMutation({
    onMutate() {
      setIsLoading(true);
      const id = toast.loading("Adding Environment Variables...");
      toastIdEnv.current = id;

      cbOnMutate && cbOnMutate();
    },
    onSuccess(data) {
      if (!data) return;

      const varText = data.length > 1 ? "variables" : "variable";

      toastIdEnv.current &&
        toast.update(toastIdEnv.current, {
          render: `${data?.length} ${varText} added successfully`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

      cbOnSuccess && cbOnSuccess();
    },
    onError(data) {
      const { message } = data;
      toastIdEnv.current &&
        toast.update(toastIdEnv.current, {
          render: (
            <div>
              <p className="text-sm">Failed to add Environment Variables</p>
              {message && <p className="text-xs">{message}</p>}
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });

      cbOnError && cbOnError();
    },

    onSettled() {
      toastIdEnv.current = null;
      setIsLoading(false);

      cbOnSettled && cbOnSettled();
    },
  });

  return { addEnvMutation, isLoading };
}
