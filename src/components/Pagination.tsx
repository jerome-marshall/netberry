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

  // Generate page numbers
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const totalPageNumbers = pageNumbers?.length;

  const handlePageChange = (value: number | string) => {
    // handle change for number based page change
    if (typeof value === "number") setCurrentPage(value);
    else
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
    <div className="pagination-container mx-auto mt-6 flex items-center justify-center gap-6">
      <button
        onClick={() => handlePageChange("back")}
        className={`button button-secondary pagination-button button-back ${
          currentPage <= 1 ? "button-disabled" : ""
        }`}
        disabled={currentPage <= 1}
      >
        <i className="icon icon-arrow-left"></i>
        <span>Back</span>
      </button>

      <div className="pagination-numbers-wrap">
        Page {currentPage} of {totalPageNumbers}
      </div>

      <button
        onClick={() => handlePageChange("next")}
        className={`button button-secondary pagination-button button-next ${
          currentPage >= totalPageNumbers ? "button-disabled" : ""
        }`}
        disabled={currentPage >= totalPageNumbers}
      >
        <span>Next</span>
        <i className="icon icon-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
