import { api } from "@/utils/api";

const useAccounts = () => {
  const queryData = api.accounts.getAll.useQuery();

  const { data: accounts } = queryData;

  const accountsOptions = accounts?.map((account) => ({
    value: account.slug,
    label: account.name,
  }));
  return {
    accounts,
    accountsOptions,
    queryData,
  };
};

export default useAccounts;
