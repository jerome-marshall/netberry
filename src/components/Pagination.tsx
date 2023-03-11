import React from "react";

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const totalPageNumbers = pageNumbers?.length;

  const handlePageChange = (value: number | string) => {
    switch (value) {
      case "back":
        setCurrentPage((page) => --page);
        break;
      case "next":
        setCurrentPage((page) => ++page);
        break;
      default:
        break;
    }
  };

  if (totalPageNumbers < 2) return null;

  return (
    <div className="mx-auto mt-6 flex items-center justify-center gap-6">
      <button
        onClick={() => handlePageChange("back")}
        className={`button`}
        disabled={currentPage <= 1}
      >
        <span>Back</span>
      </button>

      <div className="">
        Page {currentPage} of {totalPageNumbers}
      </div>

      <button
        onClick={() => handlePageChange("next")}
        className={`button`}
        disabled={currentPage >= totalPageNumbers}
      >
        <span>Next</span>
      </button>
    </div>
  );
};

export default Pagination;
