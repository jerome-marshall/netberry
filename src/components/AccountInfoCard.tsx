import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import type { AccountNoToken } from "../types";
import { api } from "../utils/api";
import Shimmer from "./Shimmer";

type Props = {
  account: AccountNoToken;
  sitesCount: number;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult>;
  isFetching: boolean;
};

const AccountInfoCard: FC<Props> = ({
  account,
  sitesCount,
  refetch,
  isFetching,
}) => {
  const { name, slug } = account;
  const sitesText = sitesCount === 1 ? "site" : "sites";

  const [isFav, setIsFav] = useState(account.isFavourite || false);

  let toastId: Id | null = null;

  useEffect(() => {
    setIsFav(!!account.isFavourite);
  }, [account, isFetching]);

  const { mutate: addFavorite } = api.accounts.addFavorite.useMutation({
    onMutate() {
      toastId = toast.loading("Hold on...");
    },
    onSettled() {
      refetch().finally(() => {
        toastId &&
          toast.update(toastId, {
            render: "Added to favourites",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });

        toastId = null;
      });
    },
  });

  const { mutate: removeFavorite } = api.accounts.removeFavorite.useMutation({
    onMutate() {
      toastId = toast.loading("Hold on...");
    },
    onSettled() {
      refetch().finally(() => {
        toastId &&
          toast.update(toastId, {
            render: "Removed from favourites",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });

        toastId = null;
      });
    },
  });

  const handleFavourite = (action: "ADD" | "REMOVE") => {
    switch (action) {
      case "ADD":
        addFavorite({
          account_slug: slug,
        });
        break;
      case "REMOVE":
        removeFavorite({
          account_slug: slug,
        });
        break;
    }
  };

  return (
    <div className="account-info-card max-w-xl rounded-medium bg-background-secondary p-card_pad">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-white">{name}</h1>
        <p className=" text-text-muted">
          {sitesCount} {sitesText}
        </p>
      </div>
      <p className="mt-2 block text-base text-text-muted">{account.email}</p>
      <div className="mt-4 flex gap-4">
        {isFav ? (
          <button
            className="button items-center gap-2"
            onClick={() => handleFavourite("REMOVE")}
            disabled={isFetching}
          >
            <AiFillStar />
            <span>Remove</span>
          </button>
        ) : (
          <button
            className="button items-center gap-2"
            onClick={() => handleFavourite("ADD")}
            disabled={isFetching}
          >
            <AiOutlineStar />
            <span>Add to Fav</span>
          </button>
        )}
      </div>
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
