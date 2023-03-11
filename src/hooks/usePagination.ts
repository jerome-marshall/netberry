import { useState } from "react";

const usePagination = <T>({
  items,
  itemsPerPage,
}: {
  items: T[] | undefined;
  itemsPerPage?: number;
}) => {
  itemsPerPage ||= 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem) || [];

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalItems: items?.length || 0,
    itemsPerPage,
  };
};

export default usePagination;
