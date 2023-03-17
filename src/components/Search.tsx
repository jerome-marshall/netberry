import React from "react";
import { CgSearch } from "react-icons/cg";

const Search = ({
  searchText,
  handleSearch,
}: {
  searchText: string;
  handleSearch: (val: string) => void;
}) => {
  return (
    <div className="search-section flex items-center gap-4 rounded-medium bg-gray-light px-4 py-2">
      <CgSearch className="h-5 w-5" />
      <input
        type="text"
        placeholder="Start typing to search"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        className=" bg-gray-light  outline-none focus:outline-none focus-visible:outline-none"
      />
    </div>
  );
};

export default Search;
