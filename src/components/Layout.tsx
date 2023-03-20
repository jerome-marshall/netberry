import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

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
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="flex flex-1 flex-col"
          variants={pageVairants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15 }}
          key={router.pathname}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
