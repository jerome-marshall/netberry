import { signIn, useSession } from "next-auth/react";
import type { FC } from "react";
import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn()
        .then(() => console.log("Signed in"))
        .catch((err) => console.log(err));
    }
  }, [status]);

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container flex min-h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
