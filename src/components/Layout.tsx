import { useSession } from "next-auth/react";
import { FC, useEffect } from "react";
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
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== "/auth/signin") {
      void router.push("/auth/signin");
    } else if (isAuthenticated && router.pathname === "/auth/signin") {
      void router.push("/");
    }
  }, [isAuthenticated, router]);

  const isPageLoading = usePageLoading();
  const [isLoading, setIsLoading] = React.useState(true);

  // debounce the loading state
  React.useEffect(() => {
    if (isPageLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, [isPageLoading]);

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
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Image
              src={netberryImg}
              width={200}
              height={200}
              alt="netberry-logo"
            />
          </div>
        ) : (
          <motion.div
            className="flex-1"
            variants={pageVairants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            key={router.pathname}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthenticated && <Footer />}
    </div>
  );
};

export default Layout;
