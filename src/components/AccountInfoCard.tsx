import type { FC } from "react";
import type { AccountNoToken } from "../types";
import Shimmer from "./Shimmer";

type Props = {
  account: AccountNoToken;
  sitesCount: number;
};

const AccountInfoCard: FC<Props> = ({ account, sitesCount }) => {
  const { id, name, slug } = account;
  const sitesText = sitesCount === 1 ? "site" : "sites";

  return (
    <div className="account-info-card max-w-xl rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-white">{name}</h1>
        <p className=" text-text-muted">
          {sitesCount} {sitesText}
        </p>
      </div>

      <p className="mt-3 block text-base text-text-muted">{account.email}</p>
    </div>
  );
};

export default AccountInfoCard;

export const LoadingAccountInfoCard: FC = () => (
  <div className="account-info-card max-w-xl rounded-medium bg-background-secondary p-card_pad">
    <div className="flex justify-between gap-20">
      <Shimmer height="lg" width="md" />
      <Shimmer height="sm" width="xs" className="mt-2" />
    </div>

    <Shimmer height="md" width="sm" className="mt-3" />
  </div>
);
