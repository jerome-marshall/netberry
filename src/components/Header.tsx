import type { FC } from "react";
import React from "react";

// interface HeaderProps {
//   children: React.ReactNode;
// }

const Header: FC = () => {
  return (
    <div className="header py-4">
      <div>
        <p className="text-2xl font-bold">NetBerry</p>
      </div>
    </div>
  );
};

export default Header;
