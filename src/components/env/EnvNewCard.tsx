import { envStringSchema } from "@/utils/schemas";
import { cn, convertStringToEnvKeyValue } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import useAddEnv from "src/hooks/useAddEnv";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { api } from "@/utils/api";

const addEnvSchema = z.object({
  envString: envStringSchema,
});

interface EnvNewCardProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  site_id: string;
  account_slug: string;
  netlify_account_id: string;
}

const EnvNewCard: FC<EnvNewCardProps> = ({
  setIsCreating,
  site_id,
  account_slug,
  netlify_account_id,
}) => {
  const form = useForm<z.infer<typeof addEnvSchema>>({
    resolver: zodResolver(addEnvSchema),
  });

  const utils = api.useContext();

  const {
    addEnvMutation: { mutate: addEnvs },
    isLoading,
  } = useAddEnv({
    cbOnSuccess() {
      form.reset();
      setIsCreating(false);
      utils.sites.getEnvs
        .invalidate({
          account_slug,
          site_id,
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  const handleAddEnv = ({ envString }: z.infer<typeof addEnvSchema>) => {
    const envs = convertStringToEnvKeyValue(envString);

    addEnvs({
      envs,
      account_slug,
      netlify_account_id,
      site_id,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col rounded-medium border border-gray-darkest bg-background-secondary p-card_pad">
      <Form {...form}>
        {/* <pre>
          <code>{JSON.stringify(form.watch(), null, 2)}</code>
        </pre> */}
        <form
          className="flex flex-col divide-y-2 divide-solid divide-background-alt_hover"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(handleAddEnv)}
        >
          <h3 className=" mb-2 font-bold text-white">
            Add Environment variables
          </h3>
          <div className="env-section pt-4">
            <div className="input-section flex gap-5">
              <div className="description max-w-[280px] text-sm text-text-muted">
                <p>Create new environment variables.</p>
                <p className="mt-2">
                  Add one or more environment variables in the format:
                </p>
                <ul className="mt-1 list-outside list-disc pl-[20px] text-text-primary">
                  <li>
                    <code>KEY=VALUE</code>
                  </li>
                  <li>
                    KEY must be uppercase, shouuld start with a letter and can
                    only contain letters, numbers, and underscores.
                  </li>
                  <li>VALUE can be any string.</li>
                  <li>
                    Multiple variables can be added by separating them with a
                    new line.
                  </li>
                </ul>
              </div>
              <FormField
                control={form.control}
                name="envString"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        rows={15}
                        className="w-full flex-1"
                        placeholder="EXAMPLE_KEY_1=EXAMPLE_VALUE_1"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="action-section">
              <div className="action-section mt-4 flex justify-end gap-3">
                <button
                  className={"button"}
                  onClick={handleCancel}
                  type="reset"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className={cn("button button-teal", isLoading && "loading")}
                  type="submit"
                >
                  <span>Add Variables</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnvNewCard;
