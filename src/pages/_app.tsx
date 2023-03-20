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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const isPageLoading = usePageLoading();

  if (isPageLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <img
          src={netberryImg.src}
          alt="Netberry"
          className="h-32 w-32 animate-bounce"
        />
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer theme="dark" />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
