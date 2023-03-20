import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "../utils/api";

import { ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import "../styles/globals.css";
import usePageLoading from "../hooks/usePageLoading";
import netberryImg from "../assets/netberry.png";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const isPageLoading = usePageLoading();

  return (
    <SessionProvider session={session}>
      <AnimatePresence mode="wait" initial={false}>
        {isPageLoading ? (
          <motion.div
            className="flex h-screen w-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Image
              src={netberryImg}
              alt="Netberry"
              className="h-32 w-32 animate-bounce"
            />
          </motion.div>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer theme="dark" />
      </AnimatePresence>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
