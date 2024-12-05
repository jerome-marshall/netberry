import { useRouter } from "next/router";
import type { FC } from "react";
import React from "react";
import { api } from "../../utils/api";
import EnvEditCard from "./EnvEditCard";
import EnvNewCard from "./EnvNewCard";

interface EnvSettingsProps {}

const EnvSettings: FC<EnvSettingsProps> = ({}) => {
  const { query } = useRouter();

  const [isCreating, setIsCreating] = React.useState(false);

  const account_slug = query.account_slug as string;
  const site_id = query.site_id as string;

  const { data, error, refetch } = api.sites.getByAccount.useQuery(
    {
      account_slug,
      site_id,
    },
    {
      retry: 2,
      enabled: !!site_id && !!account_slug,
    }
  );

  const site = data?.site;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className=" flex justify-between">
        <div className="">
          <h3 className="text-xl font-bold text-white">
            Environment variables
          </h3>
          <p className="mt-2 text-sm text-text-muted">
            Securely store secrets, API keys, tokens, and other environment
            variables
          </p>
        </div>
        <div className="flex items-end">
          <button
            className="button button-teal h-fit"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            Add Variables
          </button>
        </div>
      </div>
      {isCreating && site && (
        <EnvNewCard
          setIsCreating={setIsCreating}
          site_id={site?.id}
          account_slug={site?.account.slug}
          netlify_account_id={site?.account_id}
        />
      )}
      <EnvEditCard
        account_slug={site?.account.slug}
        site_id={site?.id}
        site_account_slug={site?.account_slug}
        netlify_account_id={site?.account_id}
      />
    </div>
  );
};

export default EnvSettings;
