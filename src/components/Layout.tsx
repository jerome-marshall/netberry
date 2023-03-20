import { useSession } from "next-auth/react";
import type { FC } from "react";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import usePageLoading from "../hooks/usePageLoading";
import Image from "next/image";
import netberryImg from "../assets/netberry.png";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { pathname } = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isPageLoading = usePageLoading();
  const [isLoading, setIsLoading] = React.useState(true);

  const pageVairants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <div className="container flex min-h-screen flex-col">
      {isAuthenticated && <Header />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="flex-1"
          variants={pageVairants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          key={pathname}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {isAuthenticated && <Footer />}
    </div>
  );
};

export default Layout;
