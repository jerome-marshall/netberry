import React from "react";
import type { FC } from "react";
import { api } from "../../utils/api";

interface EnvCardProps {
  account_slug?: string;
  site_id?: string;
  site_account_slug?: string;
}

const EnvCard: FC<EnvCardProps> = ({
  account_slug,
  site_id,
  site_account_slug,
}) => {
  const { data: envData } = api.sites.getEnvs.useQuery(
    {
      site_account_slug: account_slug,
      site_id: site_id,
      account_slug: site_account_slug,
    },
    {
      enabled: !!account_slug && !!site_id && !!site_account_slug,
      retry: 2,
    }
  );

  if (!envData) return <div>loading</div>;

  return (
    <div className="flex flex-col rounded-medium border border-gray-darkest bg-background-secondary py-card_pad">
      <div className="flex flex-col">
        {Object.entries(envData).map(([key, value]) => (
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
      </div>
    </div>
  );
};

export default EnvCard;
