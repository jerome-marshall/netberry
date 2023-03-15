import { useSession } from "next-auth/react";
import type { FC } from "react";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="container flex min-h-screen flex-col">
      {isAuthenticated && <Header />}
      {children}
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default Layout;
