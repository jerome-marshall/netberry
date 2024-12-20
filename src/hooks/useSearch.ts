import Fuse from "fuse.js";
import { useEffect, useState } from "react";

interface SearchParams<T> {
  items: T[] | undefined;
  keys: Fuse.FuseOptionKey<T>[];
}

const useSearch = <T>({ items, keys }: SearchParams<T>) => {
  const [fuse, setFuse] = useState<Fuse<T> | undefined>(undefined);
  const [resultItems, setResultItems] = useState<T[] | undefined>(undefined);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (val: string) => {
    if (!items) return;
    setSearchText(val);
  };

  useEffect(() => {
    if (!items || resultItems) return;

    setResultItems(items);

    const _fuse = new Fuse(items, {
      keys: keys,
      ignoreLocation: true,
      threshold: 0.4,
      includeScore: true,
    });

    setFuse(_fuse);
  }, [items, resultItems, keys]);

  useEffect(() => {
    if (!fuse || !items) return;

    if (searchText === "") return setResultItems(items);

    const timeout = setTimeout(() => {
      const result = fuse.search(searchText);
      const finalResult = result.map((item) => item.item);
      setResultItems(finalResult);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fuse, items, searchText]);

  return {
    searchText,
    handleSearch,
    resultItems,
  };
};

export default useSearch;
