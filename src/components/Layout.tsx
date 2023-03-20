import { useSession } from "next-auth/react";
import type { FC } from "react";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <motion.div
      className="container flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isAuthenticated && <Header />}
      {children}
      {isAuthenticated && <Footer />}
    </motion.div>
  );
};

export default Layout;
