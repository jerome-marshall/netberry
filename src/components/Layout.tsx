import { FC, useEffect } from "react";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSession, signIn, signOut } from "next-auth/react";

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
